'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Amount,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CalendarIcon,
  CheckCircleIcon,
  Divider,
  Heading,
  HeadsetIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  Radio,
  RadioGroup,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  Text,
  TextInput,
  TrashIcon,
  EditIcon,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { getProduct } from "@/lib/store/catalog";

type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

const initialAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    name: "Hemal Singh",
    phone: "+91 98765 43210",
    email: "hemal.singh@example.com",
    line1: "12-5-98/A, Road No. 3, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
  },
  {
    id: "work",
    label: "Work",
    name: "Hemal Singh",
    phone: "+91 98765 43210",
    email: "hemal.work@example.com",
    line1: "91 Springboard, 2nd Floor, Hitech City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
  },
];

const shippingMethods = [
  {
    id: "standard",
    icon: PackageIcon,
    title: "Standard Delivery",
    description: "Reliable and cost-effective delivery",
    eta: "Delivered by 24 - 27 May",
    price: 0,
  },
  {
    id: "express",
    icon: ZapIcon,
    title: "Express Delivery",
    description: "Faster delivery for urgent orders",
    eta: "Delivered by 21 - 22 May",
    price: 149,
  },
];

export default function CheckoutBlade() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddr, setSelectedAddr] = useState("home");
  const [shipping, setShipping] = useState("standard");
  const [payMethod, setPayMethod] = useState("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const cartItems = useMemo(
    () => [
      { product: getProduct("sony-wh-1000xm5"), qty: 1 },
      { product: getProduct("boat-airdopes-131-pro"), qty: 1 },
      { product: getProduct("jbl-tune-770nc"), qty: 1 },
    ].filter((x): x is { product: NonNullable<ReturnType<typeof getProduct>>; qty: number } => Boolean(x.product)),
    []
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const selectedShip = shippingMethods.find((s) => s.id === shipping);
  const shippingFee = selectedShip?.price ?? 0;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shippingFee + tax;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/store/order-success");
    }, 1200);
  };

  return (
    <BladeRoot>
      <Box backgroundColor="surface.background.gray.subtle" paddingX="spacing.7" paddingY="spacing.7">
        <Box maxWidth="1200px" margin="auto" display="flex" flexDirection="column" gap="spacing.6">
          <Heading size="large" as="h1">
            Checkout
          </Heading>

          <Box display="flex" flexDirection="row" gap="spacing.7" flexWrap="wrap" alignItems="flex-start">
            {/* Left Main Section */}
            <Box flex="2" minWidth="320px" display="flex" flexDirection="column" gap="spacing.5">
              {/* Delivery Address Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Heading size="small" as="h2">
                        1. Delivery Address
                      </Heading>
                      <Button variant="tertiary" size="small" icon={PlusIcon} onClick={() => setShowAddModal(true)}>
                        Add new address
                      </Button>
                    </Box>

                    <RadioGroup
                      label="Select a delivery address"
                      value={selectedAddr}
                      onChange={({ value }) => setSelectedAddr(value)}
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                        {addresses.map((addr) => (
                          <Box
                            key={addr.id}
                            flex="1"
                            minWidth="260px"
                            borderWidth="thin"
                            borderColor={selectedAddr === addr.id ? "interactive.border.primary.default" : "surface.border.gray.muted"}
                            borderRadius="medium"
                            padding="spacing.4"
                            backgroundColor="surface.background.gray.intense"
                          >
                            <Radio value={addr.id}>
                              <Box display="flex" flexDirection="column" gap="spacing.1">
                                <Box display="flex" gap="spacing.3" alignItems="center">
                                  <Text size="small" weight="semibold">
                                    {addr.name}
                                  </Text>
                                  <Badge color="information" size="small">
                                    {addr.label}
                                  </Badge>
                                </Box>
                                <Text size="xsmall" color="surface.text.gray.muted">
                                  {`${addr.line1}, ${addr.city}, ${addr.state} - ${addr.pincode}`}
                                </Text>
                                <Text size="xsmall" color="surface.text.gray.muted">
                                  {`Phone: ${addr.phone}`}
                                </Text>
                              </Box>
                            </Radio>
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>

              {/* Shipping Method Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Heading size="small" as="h2">
                      2. Shipping Method
                    </Heading>

                    <RadioGroup
                      label="Choose shipping option"
                      value={shipping}
                      onChange={({ value }) => setShipping(value)}
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                        {shippingMethods.map((method) => (
                          <Box
                            key={method.id}
                            flex="1"
                            minWidth="260px"
                            borderWidth="thin"
                            borderColor={shipping === method.id ? "interactive.border.primary.default" : "surface.border.gray.muted"}
                            borderRadius="medium"
                            padding="spacing.4"
                            backgroundColor="surface.background.gray.intense"
                          >
                            <Radio value={method.id}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                <Box display="flex" flexDirection="column" gap="spacing.1">
                                  <Text size="small" weight="semibold">
                                    {method.title}
                                  </Text>
                                  <Text size="xsmall" color="surface.text.gray.muted">
                                    {`${method.description} · ${method.eta}`}
                                  </Text>
                                </Box>
                                <Amount value={method.price} size="small" type="body" suffix="none" />
                              </Box>
                            </Radio>
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>

              {/* Payment Method Card */}
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5">
                    <Heading size="small" as="h2">
                      3. Payment Method
                    </Heading>

                    <RadioGroup
                      label="Select payment mode"
                      value={payMethod}
                      onChange={({ value }) => setPayMethod(value)}
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" flexWrap="wrap">
                        {[
                          { id: "upi", title: "UPI / QR Code", sub: "Google Pay, PhonePe, Paytm, BHIM" },
                          { id: "card", title: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                          { id: "netbanking", title: "Net Banking", sub: "HDFC, ICICI, SBI, Axis & all major banks" },
                          { id: "cod", title: "Cash on Delivery", sub: "Pay cash upon arrival" },
                        ].map((mode) => (
                          <Box
                            key={mode.id}
                            flex="1"
                            minWidth="240px"
                            borderWidth="thin"
                            borderColor={payMethod === mode.id ? "interactive.border.primary.default" : "surface.border.gray.muted"}
                            borderRadius="medium"
                            padding="spacing.4"
                            backgroundColor="surface.background.gray.intense"
                          >
                            <Radio value={mode.id}>
                              <Box display="flex" flexDirection="column" gap="spacing.1">
                                <Text size="small" weight="semibold">
                                  {mode.title}
                                </Text>
                                <Text size="xsmall" color="surface.text.gray.muted">
                                  {mode.sub}
                                </Text>
                              </Box>
                            </Radio>
                          </Box>
                        ))}
                      </Box>
                    </RadioGroup>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            {/* Right Summary Section */}
            <Box flex="1" minWidth="300px" display="flex" flexDirection="column" gap="spacing.5">
              <Card elevation="lowRaised" padding="spacing.5">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.4">
                    <Heading size="small" as="h2">
                      Order Summary
                    </Heading>

                    {cartItems.map(({ product, qty }) => (
                      <Box key={product.slug} display="flex" justifyContent="space-between" gap="spacing.3">
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {`${product.name} (x${qty})`}
                        </Text>
                        <Amount value={product.price * qty} size="xsmall" type="body" suffix="none" />
                      </Box>
                    ))}

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Subtotal
                      </Text>
                      <Amount value={subtotal} size="small" suffix="none" />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Shipping
                      </Text>
                      <Amount value={shippingFee} size="small" suffix="none" />
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <Text size="small" color="surface.text.gray.muted">
                        Tax (18% GST)
                      </Text>
                      <Amount value={tax} size="small" suffix="none" />
                    </Box>

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Text size="medium" weight="semibold">
                        Total Amount
                      </Text>
                      <Amount value={grandTotal} size="medium" type="heading" suffix="none" />
                    </Box>

                    <Button
                      variant="primary"
                      size="large"
                      icon={LockIcon}
                      isFullWidth
                      isLoading={isSubmitting}
                      onClick={handlePlaceOrder}
                    >
                      Pay &amp; Place Order
                    </Button>

                    <Box display="flex" alignItems="center" justifyContent="center" gap="spacing.2">
                      <ShieldIcon size="small" color="surface.icon.gray.muted" />
                      <Text size="xsmall" color="surface.text.gray.muted">
                        256-Bit SSL Encrypted Razorpay Checkout
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </BladeRoot>
  );
}
