"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Alert,
  DownloadIcon,
  RefreshIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon
} from '@razorpay/blade/components';

interface ValidationIssue {
  row: number;
  sku: string;
  message: string;
  type: string;
}

interface ImportSummary {
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  duplicatesFound: number;
  importedSuccessfully: number;
  status: string;
}

interface ImportValidationPanelProps {
  importId?: string;
  onRetry?: () => void;
  onViewProducts?: () => void;
}

export function ImportValidationPanel({ importId, onRetry, onViewProducts }: ImportValidationPanelProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (importId) {
      fetchImportDetails();
    }
  }, [importId]);

  const fetchImportDetails = async () => {
    if (!importId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/import?import_id=${importId}`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
        setIssues(data.issues || []);
      }
    } catch (err) {
      console.error('Error fetching import details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadErrors = () => {
    if (!importId) return;
    window.open(`/api/import/download-errors?import_id=${importId}`, '_blank');
  };

  if (isLoading) {
    return (
      <Box padding="spacing.4">
        <Text size="small" color="surface.text.gray.muted">Loading...</Text>
      </Box>
    );
  }

  if (!summary) {
    return null;
  }

  const isSuccess = summary.failedRows === 0;
  const isPartialSuccess = summary.failedRows > 0 && summary.successfulRows > 0;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap="spacing.3">
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Text size="xsmall" color="surface.text.gray.muted">Total Rows</Text>
            <Text size="medium" weight="semibold">{summary.totalRows}</Text>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Text size="xsmall" color="surface.text.gray.muted">Valid Rows</Text>
            <Text size="medium" weight="semibold" color="feedback.text.positive.intense">{summary.successfulRows}</Text>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Text size="xsmall" color="surface.text.gray.muted">Invalid Rows</Text>
            <Text size="medium" weight="semibold" color={summary.failedRows > 0 ? 'feedback.text.negative.intense' : undefined}>{summary.failedRows}</Text>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Text size="xsmall" color="surface.text.gray.muted">Duplicates</Text>
            <Text size="medium" weight="semibold" color="feedback.text.notice.intense">{summary.duplicatesFound}</Text>
          </CardBody>
        </Card>
        <Card elevation="none" backgroundColor="surface.background.gray.subtle">
          <CardBody>
            <Text size="xsmall" color="surface.text.gray.muted">Imported</Text>
            <Text size="medium" weight="semibold" color="feedback.text.positive.intense">{summary.importedSuccessfully}</Text>
          </CardBody>
        </Card>
      </Box>

      {/* Status Alert */}
      {isSuccess && (
        <Alert
          color="positive"
          title="Import Successful"
          description={`All ${summary.totalRows} products have been imported successfully.`}
        />
      )}

      {isPartialSuccess && (
        <Alert
          color="notice"
          title="Import Completed with Issues"
          description={`${summary.successfulRows} products imported. ${summary.failedRows} rows have issues that need to be fixed.`}
        />
      )}

      {/* Validation Issues List */}
      {issues.length > 0 && (
        <Card elevation="none" backgroundColor="surface.background.gray.intense">
          <CardBody>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.3">
              <Heading size="small">Validation Issues ({issues.length})</Heading>
              <Box display="flex" gap="spacing.2">
                <Button
                  variant="secondary"
                  size="small"
                  icon={DownloadIcon}
                  iconPosition="left"
                  onClick={handleDownloadErrors}
                >
                  Download Error Report
                </Button>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={RefreshIcon}
                  iconPosition="left"
                  onClick={fetchImportDetails}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="spacing.2" maxHeight="300px" overflow="auto">
              {issues.map((issue, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap="spacing.3"
                  padding="spacing.2"
                  backgroundColor="surface.background.gray.subtle"
                  borderRadius="small"
                >
                  <AlertCircleIcon size="small" color="feedback.icon.negative.intense" />
                  <Box flex={1}>
                    <Text size="small" weight="semibold">Row {issue.row}</Text>
                    <Text size="xsmall" color="surface.text.gray.subtle">{issue.message}</Text>
                  </Box>
                  <Badge color="negative" size="small">{issue.type.replace(/_/g, ' ')}</Badge>
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      )}

      {/* Action Buttons */}
      <Box display="flex" gap="spacing.3">
        {issues.length > 0 && (
          <Button
            variant="primary"
            icon={RefreshIcon}
            iconPosition="left"
            onClick={onRetry}
          >
            Retry Failed Rows
          </Button>
        )}
        <Button
          variant="secondary"
          icon={CheckCircleIcon}
          iconPosition="left"
          onClick={onViewProducts}
        >
          View Products
        </Button>
      </Box>
    </Box>
  );
}