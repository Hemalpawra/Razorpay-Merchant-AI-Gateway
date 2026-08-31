'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardBody, 
  TextInput, 
  Dropdown, 
  SelectInput, 
  DropdownOverlay, 
  ActionList, 
  ActionListItem,
  Badge,
  Alert,
  PlusIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@razorpay/blade/components';

export function ManualAddState({ 
  onSave, 
  onCancel 
}: { 
  onSave: () => void; 
  onCancel: () => void; 
}) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [shippingNote, setShippingNote] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [status, setStatus] = useState('Active');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name || !sku || !price) {
      alert('Please fill in Product Name, SKU Code, and Price.');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          name,
          category,
          price: parseFloat(price) || 999,
          stock_qty: parseInt(stock) || 10,
          description,
          image_url: imageUrl || null,
          tags: tags ? tags.split(',').map((t) => t.trim()) : [],
          status: status.toLowerCase() === 'active' ? 'active' : 'draft',
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => {
          onSave();
        }, 1200);
      } else {
        const err = await res.json();
        alert(`Save failed: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="840px">
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box display="flex" flexDirection="column" gap="spacing.1">
          <Heading size="medium" weight="semibold">Add single product</Heading>
          <Text size="small" color="surface.text.gray.subtle">
            Manually enter catalog details to add a single SKU directly to your Merchant AI Gateway.
          </Text>
        </Box>
        <Button variant="secondary" icon={ArrowLeftIcon} iconPosition="left" onClick={onCancel}>
          Back to Bulk Import
        </Button>
      </Box>

      {savedSuccess && (
        <Alert
          title="Product saved successfully!"
          description="The product is now active in your AI Gateway catalog."
          color="positive"
          isFullWidth
          isDismissible={false}
        />
      )}

      <Card elevation="none" backgroundColor="surface.background.gray.intense">
        <CardBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">
              
              {/* Basic Information */}
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <Heading size="small" weight="semibold">Basic Details</Heading>
                  <Badge color="neutral" size="small">Required</Badge>
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '2fr 1fr' }} gap="spacing.4">
                  <TextInput
                    label="Product Name"
                    isRequired
                    placeholder="e.g. Wireless Noise Cancelling Headphones"
                    value={name}
                    onChange={({ value }) => setName(value || '')}
                  />

                  <TextInput
                    label="SKU Code"
                    isRequired
                    placeholder="e.g. WH-1000XM5"
                    value={sku}
                    onChange={({ value }) => setSku(value || '')}
                  />
                </Box>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr 1fr' }} gap="spacing.4">
                  <Box>
                    <Dropdown>
                      <SelectInput
                        label="Category"
                        isRequired
                        value={category}
                      />
                      <DropdownOverlay>
                        <ActionList>
                          {['Electronics', 'Apparel & Fashion', 'Home & Kitchen', 'Beauty & Personal Care', 'Books & Stationery', 'Accessories'].map(cat => (
                            <ActionListItem 
                              key={cat} 
                              title={cat} 
                              value={cat} 
                              onClick={() => setCategory(cat)} 
                            />
                          ))}
                        </ActionList>
                      </DropdownOverlay>
                    </Dropdown>
                  </Box>

                  <TextInput
                    label="Price (INR)"
                    isRequired
                    placeholder="e.g. 1999"
                    prefix="₹"
                    value={price}
                    onChange={({ value }) => setPrice(value || '')}
                  />

                  <TextInput
                    label="Stock Quantity"
                    isRequired
                    placeholder="e.g. 100"
                    value={stock}
                    onChange={({ value }) => setStock(value || '')}
                  />
                </Box>
              </Box>

              {/* Media & Tags */}
              <Box display="flex" flexDirection="column" gap="spacing.4" paddingTop="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted">
                <Heading size="small" weight="semibold">Media & Classification</Heading>

                <TextInput
                  label="Product Image URL"
                  placeholder="https://images.store.com/products/headphone.jpg"
                  value={imageUrl}
                  onChange={({ value }) => setImageUrl(value || '')}
                />

                <TextInput
                  label="Tags (comma separated)"
                  placeholder="e.g. bluetooth, wireless, premium, sale"
                  value={tags}
                  onChange={({ value }) => setTags(value || '')}
                />

                <TextInput
                  label="Description"
                  placeholder="Provide detailed description for customer AI agent recommendations..."
                  value={description}
                  onChange={({ value }) => setDescription(value || '')}
                />
              </Box>

              {/* Logistics & Policies */}
              <Box display="flex" flexDirection="column" gap="spacing.4" paddingTop="spacing.4" borderTopWidth="thin" borderTopColor="surface.border.gray.muted">
                <Heading size="small" weight="semibold">Shipping & Return Notes</Heading>

                <Box display="grid" gridTemplateColumns={{ base: '1fr', m: '1fr 1fr' }} gap="spacing.4">
                  <TextInput
                    label="Shipping Note"
                    placeholder="e.g. Ships within 24 hours, free delivery"
                    value={shippingNote}
                    onChange={({ value }) => setShippingNote(value || '')}
                  />

                  <TextInput
                    label="Return Note"
                    placeholder="e.g. 7-day replacement warranty"
                    value={returnNote}
                    onChange={({ value }) => setReturnNote(value || '')}
                  />
                </Box>

                <Box width="200px">
                  <Dropdown>
                    <SelectInput
                      label="Initial Status"
                      value={status}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        {['Active', 'Draft', 'Archived'].map(st => (
                          <ActionListItem 
                            key={st} 
                            title={st} 
                            value={st} 
                            onClick={() => setStatus(st)} 
                          />
                        ))}
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </Box>
              </Box>

              {/* Form Action Buttons */}
              <Box 
                display="flex" 
                justifyContent="flex-end" 
                gap="spacing.4" 
                paddingTop="spacing.5"
                borderTopWidth="thin"
                borderTopColor="surface.border.gray.muted"
              >
                <Button variant="secondary" onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="primary" icon={PlusIcon} iconPosition="left" onClick={handleSubmit}>
                  Save Product
                </Button>
              </Box>

            </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
