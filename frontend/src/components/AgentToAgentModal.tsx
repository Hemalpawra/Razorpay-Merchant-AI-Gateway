'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  TextInput,
  SparklesIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  RefreshIcon,
  PackageIcon,
  ArrowRightIcon,
  ZapIcon
} from '@razorpay/blade/components';

interface AgentToAgentModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSelectProductForCheckout?: (product: any) => void;
}

export function AgentToAgentModal({ isOpen, onDismiss, onSelectProductForCheckout }: AgentToAgentModalProps) {
  const [prompt, setPrompt] = useState('My user needs noise cancelling wireless headphones under ₹5,000');
  const [agentName, setAgentName] = useState('ChatGPT Shopping Agent');
  const [budget, setBudget] = useState('5000');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<number>(0);
  const [response, setResponse] = useState<any>(null);

  const handleSimulateA2A = async () => {
    setIsRunning(true);
    setStep(1); // 1: Handshake
    setResponse(null);

    try {
      await new Promise(r => setTimeout(r, 800));
      setStep(2); // 2: Supabase Catalog Search

      await new Promise(r => setTimeout(r, 800));
      setStep(3); // 3: OpenRouter LLM Call

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          mode: 'agent_to_agent',
          merchant_id: 'm_demo_101'
        })
      });

      const data = await res.json();
      setResponse(data);
      setStep(4); // 4: GenUI Match Completed
    } catch (err) {
      console.error('A2A Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalHeader
        title="Agent-to-Agent (A2A) Gateway Simulator"
        subtitle="Simulate external AI agents interacting with your Merchant AI Gateway via OpenRouter LLM and Supabase DB."
      />
      <ModalBody>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {/* Input Controls */}
          <Card elevation="none" backgroundColor="surface.background.gray.subtle">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1.5fr 1fr' }} gap="spacing.3">
                  <TextInput
                    label="External Buyer Agent Name"
                    value={agentName}
                    onChange={({ value }: any) => setAgentName(value || '')}
                  />
                  <TextInput
                    label="Max Budget (INR)"
                    value={budget}
                    onChange={({ value }: any) => setBudget(value || '')}
                    prefix="₹"
                  />
                </Box>
                <TextInput
                  label="Buyer Agent Prompt Payload"
                  value={prompt}
                  onChange={({ value }: any) => setPrompt(value || '')}
                />
                <Button
                  variant="primary"
                  icon={SparklesIcon}
                  iconPosition="left"
                  isLoading={isRunning}
                  onClick={handleSimulateA2A}
                >
                  Run Agent-to-Agent Handshake
                </Button>
              </Box>
            </CardBody>
          </Card>

          {/* Workflow Progress Steps */}
          {step > 0 && (
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Heading size="small">A2A Protocol Execution Steps</Heading>

              {/* Step 1 */}
              <Box display="flex" alignItems="center" gap="spacing.3">
                <Box
                  width="28px" height="28px" borderRadius="round"
                  backgroundColor={step >= 1 ? 'surface.background.sea.subtle' : 'surface.background.gray.subtle'}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <SparklesIcon size="small" color={step >= 1 ? 'interactive.icon.positive.normal' : 'surface.icon.gray.subtle'} />
                </Box>
                <Box flex={1}>
                  <Text size="small" weight="semibold">1. Handshake Received from {agentName}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">Verified OAuth bearer token &amp; Session ID registered</Text>
                </Box>
                {step >= 1 && <Badge color="positive" size="small">Verified</Badge>}
              </Box>

              {/* Step 2 */}
              <Box display="flex" alignItems="center" gap="spacing.3">
                <Box
                  width="28px" height="28px" borderRadius="round"
                  backgroundColor={step >= 2 ? 'surface.background.sea.subtle' : 'surface.background.gray.subtle'}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <PackageIcon size="small" color={step >= 2 ? 'interactive.icon.positive.normal' : 'surface.icon.gray.subtle'} />
                </Box>
                <Box flex={1}>
                  <Text size="small" weight="semibold">2. Supabase DB Catalog Query &amp; RLS Check</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">Queried active products under ₹{budget}</Text>
                </Box>
                {step >= 2 && <Badge color="positive" size="small">Queried</Badge>}
              </Box>

              {/* Step 3 */}
              <Box display="flex" alignItems="center" gap="spacing.3">
                <Box
                  width="28px" height="28px" borderRadius="round"
                  backgroundColor={step >= 3 ? 'surface.background.sea.subtle' : 'surface.background.gray.subtle'}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <ZapIcon size="small" color={step >= 3 ? 'interactive.icon.positive.normal' : 'surface.icon.gray.subtle'} />
                </Box>
                <Box flex={1}>
                  <Text size="small" weight="semibold">3. OpenRouter LLM RAG Processing</Text>
                  <Text size="xsmall" color="surface.text.gray.muted">Model: {response?.model_used || 'meta-llama/llama-3.3-70b-instruct:free'}</Text>
                </Box>
                {step >= 3 && <Badge color="information" size="small">Processed</Badge>}
              </Box>
            </Box>
          )}

          {/* Response GenUI Card */}
          {response && (
            <Card elevation="none" backgroundColor="surface.background.gray.intense">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.4">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="small">GenUI Agent Match Result</Heading>
                    <Badge color="positive" size="small">A2A Ready</Badge>
                  </Box>

                  <Text size="small">{response.reply}</Text>

                  {response.matched_products && response.matched_products.length > 0 && (
                    <Box display="flex" flexDirection="column" gap="spacing.3">
                      {response.matched_products.map((prod: any) => (
                        <Box
                          key={prod.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          padding="spacing.3"
                          backgroundColor="surface.background.gray.subtle"
                          borderRadius="medium"
                        >
                          <Box display="flex" gap="spacing.3" alignItems="center">
                            <Box
                              width="40px" height="40px" borderRadius="medium"
                              backgroundColor="surface.background.primary.subtle"
                              display="flex" alignItems="center" justifyContent="center"
                            >
                              <PackageIcon size="medium" color="interactive.icon.primary.normal" />
                            </Box>
                            <Box>
                              <Text size="small" weight="semibold">{prod.name}</Text>
                              <Text size="xsmall" color="surface.text.gray.muted">SKU: {prod.sku} • Stock: {prod.stock}</Text>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" gap="spacing.3">
                            <Heading size="small">₹{prod.price}</Heading>
                            {onSelectProductForCheckout && (
                              <Button
                                variant="primary"
                                size="small"
                                icon={ShoppingBagIcon}
                                iconPosition="left"
                                onClick={() => {
                                  onSelectProductForCheckout(prod);
                                  onDismiss();
                                }}
                              >
                                Buy via Razorpay
                              </Button>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </CardBody>
            </Card>
          )}
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onDismiss}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}
