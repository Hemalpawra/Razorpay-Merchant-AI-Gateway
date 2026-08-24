'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Amount,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  ChatInput,
  ChatMessage as BladeChatMessage,
  Chip,
  ChipGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  EmptyState,
  Heading,
  Indicator,
  ShoppingCartIcon,
  StarIcon,
  Text,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { type Product } from "@/lib/store/catalog";
import {
  bestForLabel,
  getAssistantReply,
  quickChips,
  samplePrompts,
  type ChatMessage as ScriptChatMessage,
} from "@/lib/store/ai-chat-script";

const avatarImg = "/store/ai-assistant-avatar.png";

type ChatMessageItem = ScriptChatMessage & {
  timestamp?: string;
};

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  product?: Product | undefined;
};

function getCurrentTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatProductCard({
  item,
  onOpen,
  onAdd,
}: {
  item: Product;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <Card elevation="lowRaised" padding="spacing.4">
      <CardBody>
        <Box
          minWidth="160px"
          maxWidth="200px"
          display="flex"
          flexDirection="column"
          gap="spacing.3"
        >
          {item.badge ? (
            <Badge size="xsmall" color={item.badge === "New" ? "information" : "positive"}>
              {item.badge}
            </Badge>
          ) : null}

          <Box height="72px" display="flex" alignItems="center" justifyContent="center" backgroundColor="surface.background.gray.subtle" borderRadius="small" padding="spacing.2">
            <img
              src={item.img}
              alt={item.name}
              loading="lazy"
              style={{ maxHeight: "64px", maxWidth: "100%", objectFit: "contain" }}
            />
          </Box>

          <Text size="small" weight="semibold">
            {item.name}
          </Text>

          <Amount value={item.price} size="small" type="heading" suffix="none" />

          <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
            <StarIcon size="small" color="feedback.icon.notice.intense" />
            <Text size="xsmall" color="surface.text.gray.muted">
              {`${item.rating} (${item.reviews})`}
            </Text>
          </Box>

          <Indicator size="small" color={item.stock === "In stock" ? "positive" : "notice"}>
            {item.stock}
          </Indicator>

          <Box display="flex" flexDirection="row" gap="spacing.3" marginTop="spacing.2">
            <Box flex="1">
              <Button variant="secondary" size="xsmall" isFullWidth onClick={onOpen}>
                View
              </Button>
            </Box>
            <Button variant="primary" size="xsmall" icon={ShoppingCartIcon} onClick={onAdd} />
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}

function CompareBlock({ items }: { items: Product[] }) {
  const best = [...items].sort((a, b) => b.rating - a.rating)[0];
  return (
    <Card elevation="lowRaised" padding="spacing.4">
      <CardBody>
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Heading size="small" weight="semibold">
            Product Comparison
          </Heading>
          {items.map((item) => (
            <Box key={item.slug} display="flex" flexDirection="column" gap="spacing.2">
              <Divider />
              <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.3">
                <Text size="small" weight="semibold">
                  {item.name}
                </Text>
                <Amount value={item.price} size="small" type="body" suffix="none" />
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                {`${item.subtitle} · ${item.rating}★`}
              </Text>
              <Box>
                <Badge size="xsmall" color="information">
                  {`Best for: ${bestForLabel(item, items)}`}
                </Badge>
              </Box>
            </Box>
          ))}
          {best ? (
            <Alert
              color="positive"
              emphasis="subtle"
              isFullWidth
              isDismissible={false}
              title="AI recommendation"
              description={`${best.name} offers the best balance of rating, price and everyday performance.`}
            />
          ) : null}
        </Box>
      </CardBody>
    </Card>
  );
}

export default function AiChatDrawer({ isOpen, onDismiss, product }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [value, setValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const lastSuggested = useRef<Product[]>([]);
  const lastInput = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

  const respond = (text: string) => {
    lastInput.current = text;
    setError(null);
    setIsThinking(true);
    timer.current = setTimeout(() => {
      try {
        const reply = getAssistantReply(text, lastSuggested.current);
        if (reply.products?.length) lastSuggested.current = reply.products;
        if (reply.compare?.length) lastSuggested.current = reply.compare;
        setMessages((prev) => [
          ...prev,
          { ...reply, timestamp: getCurrentTimeString() },
        ]);
      } catch {
        setError("The assistant could not respond just now.");
      } finally {
        setIsThinking(false);
      }
    }, 700);
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "self", text: trimmed, timestamp: getCurrentTimeString() },
    ]);
    setValue("");
    respond(trimmed);
  };

  const openProduct = (item: Product) => {
    onDismiss();
    router.push(`/store/products/${item.slug}`);
  };

  const addToCart = (item: Product) => {
    setCart((prev) => [...prev, item]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <BladeRoot>
      <Drawer isOpen={isOpen} onDismiss={onDismiss} accessibilityLabel="Acme AI shopping assistant">
        <DrawerHeader
          title="Acme AI Assistant"
          subtitle="Ask me anything about products, comparisons, or buying help."
          leading={<Avatar size="medium" name="AI Assistant" src={avatarImg} />}
          titleSuffix={
            <Indicator color="positive" size="small">
              Online
            </Indicator>
          }
        />

        <DrawerBody>
          <Box display="flex" flexDirection="column" gap="spacing.5" paddingBottom="spacing.4">
            {product ? (
              <Card elevation="lowRaised" padding="spacing.4">
                <CardBody>
                  <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                    <Box width="44px" height="44px" backgroundColor="surface.background.gray.subtle" borderRadius="small" display="flex" alignItems="center" justifyContent="center">
                      <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        style={{ width: "36px", height: "36px", objectFit: "contain" }}
                      />
                    </Box>
                    <Box flex="1">
                      <Text size="xsmall" color="surface.text.gray.muted">
                        You're viewing
                      </Text>
                      <Text size="small" weight="semibold">
                        {product.name}
                      </Text>
                    </Box>
                    <Amount value={product.price} size="small" type="heading" suffix="none" />
                  </Box>
                </CardBody>
              </Card>
            ) : null}

            {messages.length === 0 && !isThinking ? (
              <EmptyState
                size="small"
                title="Your shopping assistant"
                description="I can suggest products, compare options and answer questions about specs, delivery and returns."
                asset={<Avatar size="large" name="AI assistant" src={avatarImg} />}
              >
                <ChipGroup
                  accessibilityLabel="Sample prompts"
                  selectionType="single"
                  size="small"
                  value=""
                  onChange={({ values }) => values[0] && send(values[0])}
                >
                  {samplePrompts.map((p) => (
                    <Chip key={p} value={p}>
                      {p}
                    </Chip>
                  ))}
                </ChipGroup>
              </EmptyState>
            ) : null}

            {messages.map((message) => (
              <Box key={message.id} display="flex" flexDirection="column" gap="spacing.3">
                <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="flex-start" justifyContent={message.sender === "self" ? "flex-end" : "flex-start"}>
                  {message.sender === "other" && (
                    <Avatar size="xsmall" name="Acme AI" src={avatarImg} />
                  )}
                  <Box display="flex" flexDirection="column" alignItems={message.sender === "self" ? "flex-end" : "flex-start"} gap="spacing.1">
                    <BladeChatMessage senderType={message.sender}>
                      {message.text ?? ""}
                    </BladeChatMessage>
                    {message.timestamp && (
                      <Text size="xsmall" color="surface.text.gray.muted">
                        {message.timestamp}
                      </Text>
                    )}
                  </Box>
                </Box>

                {message.products?.length ? (
                  <Box display="flex" flexDirection="row" gap="spacing.3" flexWrap="wrap">
                    {message.products.map((item) => (
                      <ChatProductCard
                        key={item.slug}
                        item={item}
                        onOpen={() => openProduct(item)}
                        onAdd={() => addToCart(item)}
                      />
                    ))}
                  </Box>
                ) : null}

                {message.compare?.length ? <CompareBlock items={message.compare} /> : null}

                {message.sender === "other" && message.chips?.length ? (
                  <ChipGroup
                    accessibilityLabel="Quick replies"
                    selectionType="single"
                    size="xsmall"
                    value=""
                    onChange={({ values }) => values[0] && send(values[0])}
                  >
                    {message.chips.map((chip) => (
                      <Chip key={chip} value={chip}>
                        {chip}
                      </Chip>
                    ))}
                  </ChipGroup>
                ) : null}
              </Box>
            ))}

            {isThinking ? (
              <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                <Avatar size="xsmall" name="Acme AI" src={avatarImg} />
                <BladeChatMessage
                  senderType="other"
                  isLoading
                  loadingText={["Thinking…", "Checking the catalogue…", "Comparing options…"]}
                />
              </Box>
            ) : null}

            {error ? (
              <Alert
                color="negative"
                emphasis="subtle"
                isFullWidth
                isDismissible={false}
                title="Couldn't get a reply"
                description={error}
                actions={{
                  primary: { text: "Retry", onClick: () => respond(lastInput.current) },
                }}
              />
            ) : null}

            {cart.length ? (
              <Card elevation="lowRaised" padding="spacing.4">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.3">
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Heading size="small">{`Cart (${cart.length})`}</Heading>
                      <Amount value={cartTotal} size="small" type="heading" suffix="none" />
                    </Box>
                    {cart.map((item, i) => (
                      <Box
                        key={`${item.slug}-${i}`}
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        gap="spacing.3"
                      >
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {item.name}
                        </Text>
                        <Amount value={item.price} size="xsmall" type="body" suffix="none" />
                      </Box>
                    ))}
                    <Button variant="primary" size="small" icon={ZapIcon} isFullWidth onClick={() => router.push('/store/checkout')}>
                      Continue to checkout
                    </Button>
                  </Box>
                </CardBody>
              </Card>
            ) : null}
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <ChipGroup
              accessibilityLabel="Suggested actions"
              selectionType="single"
              size="xsmall"
              value=""
              onChange={({ values }) => values[0] && send(values[0])}
            >
              {quickChips.map((chip) => (
                <Chip key={chip} value={chip}>
                  {chip}
                </Chip>
              ))}
            </ChipGroup>
            <ChatInput
              value={value}
              onChange={({ value: v }) => setValue(v)}
              onSubmit={({ value: v }) => send(v)}
              placeholder="Ask anything about products…"
              suggestions={samplePrompts}
              isGenerating={isThinking}
              hideFileUpload
              accessibilityLabel="Message the AI shopping assistant"
            />
          </Box>
        </DrawerFooter>
      </Drawer>
    </BladeRoot>
  );
}
