'use client';

import React, { useRef, useState } from 'react';
import { Alert, Badge, Box, Button, Heading, PlusIcon, Text, UploadIcon } from '@razorpay/blade/components';
import { ImportMethod } from './types';
import { ManualAddState, ResultState } from './components';

type ImportResult = { importedCount?: number; error?: string; success?: boolean };

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

export default function ProductImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [method, setMethod] = useState<ImportMethod>('csv');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null); setResult(null); setIsImporting(true);
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length) throw new Error('The file must include a header row and at least one product row.');
      const invalid = rows.findIndex((row) => !row.sku || !row.name || !row.price);
      if (invalid >= 0) throw new Error(`Row ${invalid + 2} is missing a required sku, name, or price.`);
      const response = await fetch('/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, products: rows }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed.');
      setResult(data);
    } catch (err) { setError(err instanceof Error ? err.message : 'Import failed.'); }
    finally { setIsImporting(false); }
  };

  return (
    <Box padding={{ base: 'spacing.4', m: 'spacing.8' }} backgroundColor="surface.background.gray.subtle" minHeight="100vh" display="flex" flexDirection="column" gap="spacing.6">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap="spacing.4"><Box display="flex" flexDirection="column" gap="spacing.1"><Box display="flex" alignItems="center" gap="spacing.3"><Heading size="2xlarge" weight="semibold">Product Import</Heading><Badge color="neutral" size="small">Live catalog</Badge></Box><Text size="small" color="surface.text.gray.subtle">Import products into the catalog used by customer AI shopping sessions.</Text></Box><Box display="flex" gap="spacing.3"><Button variant="secondary" icon={UploadIcon} iconPosition="left" onClick={() => inputRef.current?.click()}>Import products</Button><Button variant="primary" icon={PlusIcon} iconPosition="left" onClick={() => setMethod('manual')}>Add product manually</Button><input ref={inputRef} hidden type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); event.currentTarget.value = ''; }} /></Box></Box>
      <Box borderBottomWidth="thin" borderBottomColor="surface.border.gray.muted" paddingBottom="spacing.3"><Text size="small" weight="semibold">{method === 'manual' ? 'Manual add' : 'CSV upload'}</Text></Box>
      {error && <Alert color="negative" title="Import failed" description={error} />}
      {result ? <ResultState type="success" onReset={() => setResult(null)} /> : method === 'manual' ? <ManualAddState onSave={() => setResult({ success: true, importedCount: 1 })} onCancel={() => setMethod('csv')} /> : <Box display="flex" flexDirection="column" gap="spacing.5" alignItems="center" paddingY="spacing.10"><Heading size="large">Upload a CSV catalog</Heading><Text size="small" color="surface.text.gray.subtle">Required columns: sku, name, price. Optional columns: description, category, stock_qty, image_url.</Text><Button variant="primary" onClick={() => inputRef.current?.click()} isLoading={isImporting}>{isImporting ? 'Importing…' : 'Choose CSV file'}</Button><Text size="xsmall" color="surface.text.gray.subtle">Rows are validated in the browser, then sent to the live import API.</Text></Box>}
    </Box>
  );
}
