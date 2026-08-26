"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Heading,
  PlusIcon,
  Text,
  UploadIcon,
} from "@razorpay/blade/components";
import { ImportMethod } from "./types";
import {
  ImportHistory,
  ManualAddState,
  ResultState,
  type ImportSummary,
} from "./components";

type ImportResult = ImportSummary & { error?: string; success?: boolean };
type ImportHistoryRow = Record<string, any>;

function parseCsv(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const parseLine = (line: string) => {
    const values: string[] = [];
    let value = "";
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) {
        values.push(value.trim());
        value = "";
      } else value += char;
    }
    values.push(value.trim());
    return values;
  };
  const headers = parseLine(lines[0]).map((header) => header.toLowerCase());
  return lines
    .slice(1)
    .map((line) =>
      Object.fromEntries(
        headers.map((header, index) => [header, parseLine(line)[index] ?? ""]),
      ),
    );
}

export default function ProductImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<ImportMethod>("csv");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ImportHistoryRow[]>([]);

  const loadHistory = async () => {
    const response = await fetch("/api/import");
    if (!response.ok) return;
    const data = await response.json();
    setHistory(data.imports ?? []);
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    setResult(null);
    setIsImporting(true);
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length)
        throw new Error(
          "The file must include a header row and at least one product row.",
        );
      const issues = rows.flatMap((row, index) => {
        const missing = ["sku", "name", "price"].filter((field) => !row[field]);
        return missing.length
          ? [
              {
                row: index + 2,
                sku: row.sku,
                message: `Missing ${missing.join(", ")}`,
              },
            ]
          : [];
      });
      if (issues.length)
        throw new Error(
          `Row ${issues[0].row} is missing required fields: ${issues[0].message}.`,
        );
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, products: rows }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Import failed.");
      setResult({
        ...data,
        filename: file.name,
        totalRows: rows.length,
        importedCount: data.importedCount ?? 0,
        failedCount: data.failedCount ?? 0,
        duplicateCount: data.duplicateCount ?? 0,
        issues: data.issues ?? [],
      });
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Box
      padding={{ base: "spacing.4", m: "spacing.8" }}
      backgroundColor="surface.background.gray.subtle"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      gap="spacing.6"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        gap="spacing.4"
      >
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Box display="flex" alignItems="center" gap="spacing.3">
            <Heading size="2xlarge" weight="semibold">
              Product Import
            </Heading>
            <Badge color="neutral" size="small">
              Live catalog
            </Badge>
          </Box>
          <Text size="small" color="surface.text.gray.subtle">
            Import products into the catalog used by customer AI shopping
            sessions.
          </Text>
        </Box>
        <Box display="flex" gap="spacing.3">
          <Button
            variant="secondary"
            icon={UploadIcon}
            iconPosition="left"
            onClick={() => inputRef.current?.click()}
          >
            Import products
          </Button>
          <Button
            variant="primary"
            icon={PlusIcon}
            iconPosition="left"
            onClick={() => setMethod("manual")}
          >
            Add product manually
          </Button>
          <input
            ref={inputRef}
            hidden
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleFile(file);
              event.currentTarget.value = "";
            }}
          />
        </Box>
      </Box>
      <Box
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingBottom="spacing.3"
      >
        <Text size="small" weight="semibold">
          {method === "manual" ? "Manual add" : "CSV upload"}
        </Text>
      </Box>
      {error && (
        <Alert color="negative" title="Import failed" description={error} />
      )}
      {result ? (
        <ResultState summary={result} onReset={() => setResult(null)} />
      ) : method === "manual" ? (
        <ManualAddState
          onSave={() =>
            setResult({
              filename: "Manual product",
              totalRows: 1,
              importedCount: 1,
              failedCount: 0,
              duplicateCount: 0,
              issues: [],
              success: true,
            })
          }
          onCancel={() => setMethod("csv")}
        />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          gap="spacing.5"
          alignItems="center"
          paddingY="spacing.10"
        >
          <Heading size="large">Upload a CSV catalog</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Required columns: sku, name, price. Optional columns: description,
            category, stock_qty, image_url.
          </Text>
          <Button
            variant="primary"
            onClick={() => inputRef.current?.click()}
            isLoading={isImporting}
          >
            {isImporting ? "Importing…" : "Choose CSV file"}
          </Button>
          <Text size="xsmall" color="surface.text.gray.subtle">
            Rows are validated in the browser, then sent to the live import API.
          </Text>
        </Box>
      )}
      {!result && method === "csv" && (
        <ImportHistory imports={history} onSelect={() => setResult(null)} />
      )}
    </Box>
  );
}
