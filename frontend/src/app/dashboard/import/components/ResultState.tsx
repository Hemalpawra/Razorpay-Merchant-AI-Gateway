"use client";

import React from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  RefreshIcon,
  UploadIcon,
  Text,
} from "@razorpay/blade/components";

const BADGE_COLOR = {
  neutral: 'neutral',
  positive: 'positive',
  negative: 'negative',
  notice: 'notice',
} as const;

export type ImportIssue = { row: number; message: string; sku?: string };
export type ImportSummary = {
  filename?: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  duplicateCount: number;
  issues: ImportIssue[];
};

export function ResultState({
  summary,
  onReset,
}: {
  summary: ImportSummary;
  onReset: () => void;
}) {
  const hasIssues = summary.failedCount > 0 || summary.issues.length > 0;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Alert
        title={
          hasIssues
            ? "Import completed with issues"
            : "Import completed successfully"
        }
        description={`${summary.importedCount} products imported${summary.duplicateCount ? `, ${summary.duplicateCount} duplicates skipped` : ""}${summary.failedCount ? `, ${summary.failedCount} rows need attention` : "."}`}
        color={hasIssues ? "notice" : "positive"}
        isFullWidth
        isDismissible={false}
      />
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", m: "repeat(4, 1fr)" }}
        gap="spacing.4"
      >
        {[
          ["Total rows", summary.totalRows, "neutral"],
          ["Products imported", summary.importedCount, "positive"],
          ["Issues", summary.failedCount, hasIssues ? "negative" : "positive"],
          [
            "Duplicates skipped",
            summary.duplicateCount,
            summary.duplicateCount ? "notice" : "neutral",
          ],
        ].map(([label, value, color]) => (
          <Card
            key={label}
            elevation="none"
            backgroundColor="surface.background.gray.intense"
          >
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text size="small" color="surface.text.gray.subtle">
                    {label}
                  </Text>
                  <Badge color={BADGE_COLOR[color as keyof typeof BADGE_COLOR]} size="small">
                    {label === "Issues" && !hasIssues
                      ? "Clear"
                      : label === "Products imported"
                        ? "Active"
                        : ""}
                  </Badge>
                </Box>
                <Heading size="xlarge" weight="semibold">
                  {value}
                </Heading>
              </Box>
            </CardBody>
          </Card>
        ))}
      </Box>
      <Box display="flex" gap="spacing.4" alignItems="center" flexWrap="wrap">
        <Link href="/dashboard/products">
          <Button variant="primary">View products in catalog</Button>
        </Link>
        <Button
          variant="secondary"
          icon={UploadIcon}
          iconPosition="left"
          onClick={onReset}
        >
          Import another file
        </Button>
      </Box>
      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" flexDirection="column" gap="spacing.1">
                <Heading size="small" weight="semibold">
                  Issues in this import
                </Heading>
                <Text size="small" color="surface.text.gray.subtle">
                  {summary.filename || "Uploaded CSV"} · Review failed rows
                  before re-importing.
                </Text>
              </Box>
              <Badge color={hasIssues ? "negative" : "positive"} size="small">
                {hasIssues ? `${summary.issues.length} found` : "No issues"}
              </Badge>
            </Box>
            {summary.issues.length ? (
              <Box display="flex" flexDirection="column" gap="spacing.2">
                {summary.issues.slice(0, 20).map((issue) => (
                  <Box
                    key={`${issue.row}-${issue.message}`}
                    display="flex"
                    justifyContent="space-between"
                    gap="spacing.4"
                    padding="spacing.3"
                    backgroundColor="surface.background.gray.subtle"
                    borderRadius="small"
                  >
                    <Text size="small" weight="semibold">
                      Row {issue.row}
                      {issue.sku ? ` · ${issue.sku}` : ""}
                    </Text>
                    <Text size="small" color="surface.text.gray.subtle">
                      {issue.message}
                    </Text>
                  </Box>
                ))}
              </Box>
            ) : (
              <Text size="small">
                All rows passed validation and were imported.
              </Text>
            )}
          </Box>
        </CardBody>
      </Card>
      <Button
        variant="tertiary"
        icon={RefreshIcon}
        iconPosition="left"
        onClick={onReset}
      >
        Start a new import
      </Button>
    </Box>
  );
}

export function ImportHistory({
  imports,
  onSelect,
}: {
  imports: Array<Record<string, any>>;
  onSelect: (item: Record<string, any>) => void;
}) {
  return (
    <Card elevation="none" backgroundColor="surface.background.gray.intense">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Heading size="small" weight="semibold">
            Previous imports
          </Heading>
          {imports.length ? (
            imports.map((item) => (
              <Button
                key={item.id}
                variant="tertiary"
                onClick={() => onSelect(item)}
              >
                <Box display="flex" width="100%" justifyContent="space-between">
                  <Text>{item.filename || "Catalog import"}</Text>
                  <Text size="small" color="surface.text.gray.subtle">
                    {item.successful_rows ?? 0} imported ·{" "}
                    {item.failed_rows ?? 0} issues
                  </Text>
                </Box>
              </Button>
            ))
          ) : (
            <Text size="small" color="surface.text.gray.subtle">
              No previous imports yet.
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
