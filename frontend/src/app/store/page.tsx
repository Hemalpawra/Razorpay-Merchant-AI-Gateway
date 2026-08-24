'use client';

import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  TextInput,
  SparklesIcon,
  ShoppingBagIcon,
  SearchIcon,
  CheckCircleIcon,
  ShieldIcon,
  ArrowRightIcon,
  UserIcon,
  BoxIcon,
  RefreshIcon,
  HeadphoneIcon,
  MapPinIcon,
  HeartIcon,
} from '@razorpay/blade/components';
import Link from 'next/link';

// ── Supabase Storage Base URL ────────────────────────────────────────────────
const CDN = 'https://rymdnhuantqqfcnnoeud.supabase.co/storage/v1/object/public/store-assets';

const IMGS = {
  hero: `${CDN}/hero-collage.jpg`,
  aiRobot: `${CDN}/ai-robot.jpg`,
  products: {
    airpods: `${CDN}/prod-airpods.jpg`,
    macbook: `${CDN}/prod-macbook.jpg`,
    sony: `${CDN}/prod-sony-wh.jpg`,
    iphone: `${CDN}/prod-iphone.jpg`,
    boat: `${CDN}/prod-boat.jpg`,
    jbl: `${CDN}/prod-jbl.jpg`,
  },
  categories: {
    electronics: `${CDN}/cat-electronics.jpg`,
    laptops: `${CDN}/cat-laptops.jpg`,
    audio: `${CDN}/cat-audio.jpg`,
    accessories: `${CDN}/cat-accessories.jpg`,
    gaming: `${CDN}/cat-gaming.jpg`,
    mobile: `${CDN}/prod-iphone.jpg`,
    office: `${CDN}/cat-accessories.jpg`,
    wearables: `${CDN}/prod-boat.jpg`,
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const categories = [
  { name: 'Electronics', count: '120+', img: IMGS.categories.electronics },
  { name: 'Laptops', count: '85+', img: IMGS.categories.laptops },
  { name: 'Audio', count: '60+', img: IMGS.categories.audio },
  { name: 'Accessories', count: '200+', img: IMGS.categories.accessories },
  { name: 'Gaming', count: '70+', img: IMGS.categories.gaming },
  { name: 'Mobile', count: '95+', img: IMGS.categories.mobile },
  { name: 'Office', count: '45+', img: IMGS.categories.office },
  { name: 'Wearables', count: '50+', img: IMGS.categories.wearables },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Sony WH-1000XM5',
    subtitle: 'Wireless Noise Cancelling Headphones',
    price: '₹29,990',
    oldPrice: '₹34,990',
    discount: '14% OFF',
    rating: '4.5',
    reviews: '980',
    stock: 'In stock',
    stockOk: true,
    badge: 'Bestseller',
    badgeColor: 'positive' as const,
    img: IMGS.products.sony,
  },
  {
    id: 2,
    name: 'boAt Rockerz 450',
    subtitle: 'Wireless Headphones',
    price: '₹1,599',
    oldPrice: '₹1,799',
    discount: '11% OFF',
    rating: '4.4',
    reviews: '1.2K',
    stock: 'In stock',
    stockOk: true,
    badge: '10% OFF',
    badgeColor: 'notice' as const,
    img: IMGS.products.boat,
  },
  {
    id: 3,
    name: 'Apple AirPods Pro (2nd Gen)',
    subtitle: 'True Wireless Earbuds',
    price: '₹24,900',
    oldPrice: '',
    discount: '',
    rating: '4.6',
    reviews: '2.1K',
    stock: 'In stock',
    stockOk: true,
    badge: 'Bestseller',
    badgeColor: 'positive' as const,
    img: IMGS.products.airpods,
  },
  {
    id: 4,
    name: 'MacBook Air M2 (13-inch)',
    subtitle: 'Apple M2 Chip, 8GB RAM, 256GB SSD',
    price: '₹89,900',
    oldPrice: '₹99,900',
    discount: '10% OFF',
    rating: '4.7',
    reviews: '1.2K',
    stock: 'In stock',
    stockOk: true,
    badge: '10% OFF',
    badgeColor: 'notice' as const,
    img: IMGS.products.macbook,
  },
  {
    id: 5,
    name: 'iPhone 15 (128GB)',
    subtitle: 'Dynamic Island, 48MP Main Camera',
    price: '₹69,900',
    oldPrice: '₹79,900',
    discount: '12% OFF',
    rating: '4.7',
    reviews: '3.2K',
    stock: 'Low stock',
    stockOk: false,
    badge: 'Bestseller',
    badgeColor: 'positive' as const,
    img: IMGS.products.iphone,
  },
  {
    id: 6,
    name: 'JBL Flip 6 Bluetooth Speaker',
    subtitle: 'Portable Waterproof Speaker',
    price: '₹9,999',
    oldPrice: '₹11,999',
    discount: '16% OFF',
    rating: '4.6',
    reviews: '870',
    stock: 'In stock',
    stockOk: true,
    badge: 'New',
    badgeColor: 'information' as const,
    img: IMGS.products.jbl,
  },
];

const bestSellers = [
  { rank: 1, name: 'Apple AirPods Pro (2nd Gen)', price: '₹24,900', rating: '4.6', img: IMGS.products.airpods },
  { rank: 2, name: 'boAt Rockerz 450', price: '₹1,599', rating: '4.4', img: IMGS.products.boat },
  { rank: 3, name: 'Samsung Galaxy S24', price: '₹59,999', rating: '4.6', img: IMGS.products.iphone },
  { rank: 4, name: 'Noise ColorFit Pro 5', price: '₹3,499', rating: '4.3', img: IMGS.products.boat },
  { rank: 5, name: 'Dell 15 Laptop', price: '₹45,990', rating: '4.5', img: IMGS.products.macbook },
];

const aiPrompts = [
  'I need a laptop under ₹60,000',
  'Which headphones are best for travel?',
  'Compare iPhone 15 and Samsung S24',
];

const navLinks = ['Electronics', 'Laptops', 'Audio', 'Accessories', 'Mobile', 'Gaming', 'Office', 'Wearables', 'Deals'];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StoreHomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box backgroundColor="surface.background.gray.subtle" minHeight="100vh">

      {/* ── Announcement Strip ── */}
      <Box
        backgroundColor="surface.background.gray.intense"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingY="spacing.2"
        paddingX="spacing.8"
        display="flex"
        justifyContent="center"
        gap="spacing.6"
        flexWrap="wrap"
      >
        {[
          { icon: BoxIcon, text: 'Free shipping on orders above ₹1,499' },
          { icon: RefreshIcon, text: '7 Days easy returns' },
          { icon: ShieldIcon, text: 'Secure payments powered by Razorpay' },
          { icon: MapPinIcon, text: 'Deliver to India' },
        ].map((item, i) => (
          <Box key={i} display="flex" alignItems="center" gap="spacing.1">
            <item.icon size="xsmall" color="surface.icon.gray.muted" />
            <Text size="xsmall" color="surface.text.gray.muted">{item.text}</Text>
          </Box>
        ))}
      </Box>

      {/* ── Header ── */}
      <Box
        backgroundColor="surface.background.gray.intense"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingY="spacing.4"
        paddingX="spacing.8"
        display="flex"
        alignItems="center"
        gap="spacing.4"
        position="sticky"
        top="spacing.0"
        zIndex={100}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center" gap="spacing.2" flexShrink={0}>
          <Box
            width="32px" height="32px" borderRadius="medium"
            backgroundColor="surface.background.primary.intense"
            display="flex" alignItems="center" justifyContent="center"
          >
            <ShoppingBagIcon size="small" color="interactive.icon.staticWhite.normal" />
          </Box>
          <Text size="medium" weight="semibold">Acme Store</Text>
        </Box>

        {/* Search */}
        <Box flex={1} maxWidth="520px" marginX="spacing.4">
          <TextInput
            label=""
            placeholder="Search for products, categories or brands"
            value={searchQuery}
            onChange={({ value }) => setSearchQuery(value || '')}
            leadingIcon={SearchIcon}
          />
        </Box>

        {/* Nav + Actions */}
        <Box display="flex" alignItems="center" gap="spacing.4" flexShrink={0}>
          <Button variant="tertiary" size="small">Categories</Button>
          <Button variant="tertiary" size="small">Products</Button>
          <Button variant="secondary" size="small" icon={SparklesIcon} iconPosition="left">Ask AI</Button>
          <Box position="relative">
            <Button variant="tertiary" size="small" icon={ShoppingBagIcon} />
            <Box
              position="absolute" top="-4px" right="-4px"
              backgroundColor="surface.background.primary.intense"
              borderRadius="round" width="16px" height="16px"
              display="flex" alignItems="center" justifyContent="center"
            >
              <Text size="xsmall" color="surface.text.staticWhite.normal" weight="semibold">2</Text>
            </Box>
          </Box>
          <Button variant="tertiary" size="small" icon={UserIcon} />
        </Box>
      </Box>

      {/* ── Category Nav ── */}
      <Box
        backgroundColor="surface.background.gray.intense"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        paddingY="spacing.3"
        paddingX="spacing.8"
        display="flex"
        gap="spacing.6"
        overflowX="auto"
      >
        {navLinks.map((link) => (
          <div key={link} style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>
            <Text
              size="small"
              color={link === 'Deals' ? 'interactive.text.negative.normal' : 'surface.text.gray.normal'}
              weight={link === 'Deals' ? 'semibold' : 'regular'}
            >
              {link}
            </Text>
          </div>
        ))}
      </Box>

      <Box paddingX="spacing.8" paddingY="spacing.6" display="flex" flexDirection="column" gap="spacing.8">

        {/* ── Hero Section ── */}
        <Box
          backgroundColor="surface.background.gray.intense"
          borderRadius="large"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          overflow="hidden"
          display="flex"
          flexDirection={{ base: 'column', l: 'row' }}
          alignItems="stretch"
          minHeight="280px"
        >
          {/* Left: Content */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap="spacing.4"
            padding="spacing.8"
          >
            <Box>
              <Badge color="positive" size="small">New Arrival</Badge>
            </Box>
            <Box>
              <Heading size="2xlarge" weight="semibold">
                Technology that{' '}
              </Heading>
              <Heading size="2xlarge" weight="semibold" color="interactive.text.primary.normal">
                moves
              </Heading>
              <Heading size="2xlarge" weight="semibold">
                {' '}with you
              </Heading>
            </Box>
            <Text size="small" color="surface.text.gray.muted">
              Explore the latest electronics, smart accessories and more. Handpicked for you.
            </Text>
            <Box display="flex" gap="spacing.3" flexWrap="wrap">
              <Button variant="primary" size="medium" icon={ArrowRightIcon} iconPosition="right">
                Shop Now
              </Button>
              <Button variant="secondary" size="medium" icon={SparklesIcon} iconPosition="left">
                Ask AI Assistant
              </Button>
            </Box>
            <Box display="flex" gap="spacing.5">
              {[
                { icon: CheckCircleIcon, text: '100% Original Products' },
                { icon: ShieldIcon, text: 'Secure Payments' },
                { icon: RefreshIcon, text: 'Easy Returns' },
              ].map((t, i) => (
                <Box key={i} display="flex" alignItems="center" gap="spacing.1">
                  <t.icon size="xsmall" color="interactive.icon.positive.normal" />
                  <Text size="xsmall" color="surface.text.gray.muted">{t.text}</Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: Hero Image */}
          <Box
            width={{ base: '100%', l: '420px' }}
            flexShrink={0}
            backgroundColor="surface.background.primary.subtle"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <img
              src={IMGS.hero}
              alt="Featured products"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Box>

        {/* ── Shop by Category ── */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
            <Heading size="large" weight="semibold">Shop by Category</Heading>
            <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
              View all categories
            </Button>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{ base: 'repeat(2,1fr)', m: 'repeat(4,1fr)', l: 'repeat(8,1fr)' }}
            gap="spacing.3"
          >
            {categories.map((cat) => (
              <div key={cat.name} style={{ cursor: 'pointer' }}>
                <Box
                  backgroundColor="surface.background.gray.intense"
                  borderRadius="large"
                  borderWidth="thin"
                  borderColor="surface.border.gray.muted"
                  padding="spacing.4"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap="spacing.2"
                >
                  <Box
                    width="72px"
                    height="64px"
                    borderRadius="medium"
                    overflow="hidden"
                    backgroundColor="surface.background.gray.subtle"
                  >
                    <img
                      src={cat.img}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                  <Text size="xsmall" weight="semibold" textAlign="center">{cat.name}</Text>
                  <Text size="xsmall" color="surface.text.gray.muted" textAlign="center">{cat.count} products</Text>
                </Box>
              </div>
            ))}
          </Box>
        </Box>

        {/* ── Featured Products ── */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
            <Heading size="large" weight="semibold">Featured Products</Heading>
            <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
              View all products
            </Button>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(3,1fr)' }}
            gap="spacing.4"
          >
            {featuredProducts.map((product) => (
              <Box
                key={product.id}
                backgroundColor="surface.background.gray.intense"
                borderRadius="large"
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                padding="spacing.4"
                display="flex"
                flexDirection="column"
                gap="spacing.3"
              >
                {/* Badge & Heart Wishlist Icon Row */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {product.badge ? (
                    <Badge color={product.badgeColor} size="small">{product.badge}</Badge>
                  ) : <Box />}
                  <div style={{ cursor: 'pointer' }}>
                    <Box
                      width="32px"
                      height="32px"
                      borderRadius="round"
                      backgroundColor="surface.background.gray.subtle"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <HeartIcon size="small" color="surface.icon.gray.muted" />
                    </Box>
                  </div>
                </Box>

                {/* Product Image */}
                <Box
                  height="190px"
                  backgroundColor="surface.background.gray.subtle"
                  borderRadius="medium"
                  overflow="hidden"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                  />
                </Box>

                {/* Product Info */}
                <Box display="flex" flexDirection="column" gap="spacing.2" flex={1}>
                  {/* Title & Subtitle */}
                  <Box display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="medium" weight="semibold">{product.name}</Text>
                    {product.subtitle && (
                      <Text size="xsmall" color="surface.text.gray.muted">{product.subtitle}</Text>
                    )}
                  </Box>

                  {/* Rating */}
                  <Box display="flex" alignItems="center" gap="spacing.1">
                    <Text size="xsmall" color="interactive.text.notice.normal" weight="semibold">★ {product.rating}</Text>
                    <Text size="xsmall" color="surface.text.gray.muted">({product.reviews})</Text>
                  </Box>

                  {/* Price Row */}
                  <Box display="flex" alignItems="center" gap="spacing.2" flexWrap="wrap">
                    <Text size="large" weight="semibold">{product.price}</Text>
                    {product.oldPrice && (
                      <div style={{ textDecoration: 'line-through' }}>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {product.oldPrice}
                        </Text>
                      </div>
                    )}
                    {product.discount && (
                      <Badge color="positive" size="small">{product.discount}</Badge>
                    )}
                  </Box>

                  {/* Stock */}
                  <Box display="flex" alignItems="center" gap="spacing.1">
                    <Box
                      width="6px" height="6px" borderRadius="round"
                      backgroundColor={product.stockOk ? 'surface.background.sea.intense' : 'surface.background.cloud.intense'}
                    />
                    <Text
                      size="xsmall"
                      color={product.stockOk ? 'interactive.text.positive.normal' : 'interactive.text.notice.normal'}
                      weight="semibold"
                    >
                      {product.stock}
                    </Text>
                  </Box>
                </Box>

                {/* Dual Action Buttons (Add to Cart + Buy Now) */}
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap="spacing.2" marginTop="auto" paddingTop="spacing.2">
                  <Button variant="secondary" size="small" icon={ShoppingBagIcon} iconPosition="left" isFullWidth>
                    Add to Cart
                  </Button>
                  <Button variant="primary" size="small" isFullWidth>
                    Buy Now
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── AI Assistant Section ── */}
        <Box
          backgroundColor="surface.background.primary.subtle"
          borderRadius="large"
          borderWidth="thin"
          borderColor="surface.border.primary.muted"
          padding="spacing.8"
          display="flex"
          flexDirection={{ base: 'column', l: 'row' }}
          alignItems="center"
          gap="spacing.8"
        >
          {/* Robot illustration */}
          <Box
            width="96px" height="96px"
            flexShrink={0}
            borderRadius="large"
            overflow="hidden"
            backgroundColor="surface.background.primary.subtle"
          >
            <img
              src={IMGS.aiRobot}
              alt="AI Assistant"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>

          {/* Text + prompts */}
          <Box flex={1} display="flex" flexDirection="column" gap="spacing.3">
            <Box>
              <Badge color="information" size="small">Shopping made smarter with AI</Badge>
            </Box>
            <Heading size="large" weight="semibold">Ask anything. Get the right answer.</Heading>
            <Text size="small" color="surface.text.gray.muted">
              Our AI assistant can help you find the perfect product, compare options and make confident decisions.
            </Text>
            <Box display="flex" flexWrap="wrap" gap="spacing.2">
              {aiPrompts.map((prompt, i) => (
                <div key={i} style={{ cursor: 'pointer' }}>
                  <Box
                    backgroundColor="surface.background.gray.intense"
                    borderRadius="round"
                    borderWidth="thin"
                    borderColor="surface.border.primary.muted"
                    paddingX="spacing.3"
                    paddingY="spacing.2"
                  >
                    <Text size="xsmall" color="interactive.text.primary.normal">💬 {prompt}</Text>
                  </Box>
                </div>
              ))}
            </Box>
          </Box>

          {/* CTA */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2" flexShrink={0}>
            <Button variant="primary" size="large" icon={SparklesIcon} iconPosition="left">
              Ask AI Assistant
            </Button>
            <Text size="xsmall" color="surface.text.gray.muted">Powered by Merchant AI Gateway</Text>
          </Box>
        </Box>

        {/* ── Trust Strip ── */}
        <Box
          backgroundColor="surface.background.gray.intense"
          borderRadius="large"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          padding="spacing.6"
        >
          <Box
            display="grid"
            gridTemplateColumns={{ base: 'repeat(2,1fr)', m: 'repeat(5,1fr)' }}
            gap="spacing.4"
          >
            {[
              { icon: ShieldIcon, title: 'Secure Payments', sub: 'Powered by Razorpay' },
              { icon: BoxIcon, title: 'Fast Delivery', sub: 'Pan India Delivery' },
              { icon: RefreshIcon, title: '7 Day Returns', sub: 'Hassle-free returns' },
              { icon: HeadphoneIcon, title: '24/7 Support', sub: "We're here to help" },
              { icon: MapPinIcon, title: 'Order Tracking', sub: 'Track your orders' },
            ].map((trust, i) => (
              <Box key={i} display="flex" flexDirection="column" alignItems="center" gap="spacing.2" textAlign="center">
                <Box
                  width="44px" height="44px"
                  backgroundColor="surface.background.primary.subtle"
                  borderRadius="large"
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <trust.icon size="medium" color="interactive.icon.primary.normal" />
                </Box>
                <Text size="small" weight="semibold">{trust.title}</Text>
                <Text size="xsmall" color="surface.text.gray.muted">{trust.sub}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Best Sellers ── */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="spacing.4">
            <Heading size="large" weight="semibold">Best Sellers</Heading>
            <Button variant="tertiary" size="small" icon={ArrowRightIcon} iconPosition="right">
              View all best sellers
            </Button>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', m: 'repeat(3,1fr)', l: 'repeat(5,1fr)' }}
            gap="spacing.3"
          >
            {bestSellers.map((item) => {
              const badgeBg =
                item.rank <= 2
                  ? 'surface.background.primary.intense'
                  : item.rank === 3
                  ? 'surface.background.cloud.intense'
                  : 'surface.background.gray.subtle';

              const badgeTextColor =
                item.rank <= 3 ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal';

              return (
                <div key={item.rank} style={{ cursor: 'pointer' }}>
                  <Box
                    backgroundColor="surface.background.gray.intense"
                    borderRadius="large"
                    borderWidth="thin"
                    borderColor="surface.border.gray.muted"
                    padding="spacing.3"
                    display="flex"
                    alignItems="center"
                    gap="spacing.3"
                  >
                    {/* Rank Badge */}
                    <Box
                      width="24px"
                      height="24px"
                      backgroundColor={badgeBg as any}
                      borderRadius="round"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text size="xsmall" weight="semibold" color={badgeTextColor as any}>
                        {item.rank}
                      </Text>
                    </Box>
  
                    {/* Product Thumbnail */}
                    <Box
                      width="44px"
                      height="44px"
                      borderRadius="medium"
                      overflow="hidden"
                      backgroundColor="surface.background.gray.subtle"
                      flexShrink={0}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                      />
                    </Box>
  
                    {/* Title, Price, Rating */}
                    <Box flex={1} display="flex" flexDirection="column" gap="spacing.1" overflow="hidden">
                      <Text size="xsmall" weight="semibold" truncateAfterLines={1}>
                        {item.name}
                      </Text>
                      <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.1">
                        <Text size="xsmall" weight="semibold">{item.price}</Text>
                        <Text size="xsmall" color="interactive.text.notice.normal" weight="semibold">
                          ★ {item.rating}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </div>
              );
            })}
          </Box>
        </Box>

        {/* ── Footer ── */}
        <Box
          backgroundColor="surface.background.gray.intense"
          borderRadius="large"
          borderWidth="thin"
          borderColor="surface.border.gray.muted"
          padding="spacing.8"
        >
          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', m: 'repeat(2,1fr)', l: 'repeat(5,1fr)' }}
            gap="spacing.8"
            marginBottom="spacing.8"
          >
            {/* Brand */}
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" alignItems="center" gap="spacing.2">
                <Box width="28px" height="28px" borderRadius="medium" backgroundColor="surface.background.primary.intense" display="flex" alignItems="center" justifyContent="center">
                  <ShoppingBagIcon size="xsmall" color="interactive.icon.staticWhite.normal" />
                </Box>
                <Text size="medium" weight="semibold">Acme Store</Text>
              </Box>
              <Text size="xsmall" color="surface.text.gray.muted">
                Your trusted destination for the latest electronics and smart accessories.
              </Text>
              <Box display="flex" gap="spacing.2">
                {['f', 'in', 'X', '▶'].map((s, i) => (
                  <div key={i} style={{ cursor: 'pointer' }}>
                    <Box
                      width="28px" height="28px"
                      backgroundColor="surface.background.gray.subtle"
                      borderRadius="round"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <Text size="xsmall" color="surface.text.gray.muted">{s}</Text>
                    </Box>
                  </div>
                ))}
              </Box>
            </Box>

            {/* Shop */}
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" weight="semibold" marginBottom="spacing.1">Shop</Text>
              {['All Products', 'Laptops', 'Mobile', 'Accessories', 'Audio', 'Deals'].map((link) => (
                <div key={link} style={{ cursor: 'pointer' }}>
                  <Text size="xsmall" color="surface.text.gray.muted">{link}</Text>
                </div>
              ))}
            </Box>

            {/* Help */}
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" weight="semibold" marginBottom="spacing.1">Help & Support</Text>
              {['Help Center', 'Track Order', 'Returns & Refunds', 'Shipping Info', 'FAQ', 'Contact Us'].map((link) => (
                <div key={link} style={{ cursor: 'pointer' }}>
                  <Text size="xsmall" color="surface.text.gray.muted">{link}</Text>
                </div>
              ))}
            </Box>

            {/* Policies */}
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="small" weight="semibold" marginBottom="spacing.1">Policies</Text>
              {['Terms & Conditions', 'Privacy Policy', 'Cancellation Policy', 'Return Policy', 'Shipping Policy'].map((link) => (
                <div key={link} style={{ cursor: 'pointer' }}>
                  <Text size="xsmall" color="surface.text.gray.muted">{link}</Text>
                </div>
              ))}
            </Box>

            {/* Newsletter */}
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Text size="small" weight="semibold">Stay updated</Text>
              <Text size="xsmall" color="surface.text.gray.muted">
                Subscribe to get special offers, free giveaways and once-in-a-lifetime deals.
              </Text>
              <TextInput label="" placeholder="Enter your email" />
              <Button variant="primary" size="small" isFullWidth>Subscribe</Button>
            </Box>
          </Box>

          {/* Footer Bottom */}
          <Box
            borderTopWidth="thin"
            borderTopColor="surface.border.gray.muted"
            paddingTop="spacing.5"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="spacing.3"
          >
            <Text size="xsmall" color="surface.text.gray.muted">© 2025 Acme Store. All rights reserved.</Text>
            <Box display="flex" alignItems="center" gap="spacing.3" flexWrap="wrap">
              {['Razorpay', 'VISA', 'MC', 'RuPay', 'UPI'].map((pay) => (
                <Box
                  key={pay}
                  backgroundColor="surface.background.gray.subtle"
                  borderRadius="small"
                  paddingX="spacing.2"
                  paddingY="spacing.1"
                  borderWidth="thin"
                  borderColor="surface.border.gray.muted"
                >
                  <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">{pay}</Text>
                </Box>
              ))}
              <Box display="flex" alignItems="center" gap="spacing.1">
                <ShieldIcon size="xsmall" color="interactive.icon.positive.normal" />
                <Text size="xsmall" color="surface.text.gray.muted">100% Secure Payments</Text>
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>

      {/* ── Floating Ask AI Button ── */}
      <Box position="fixed" bottom="spacing.8" right="spacing.8" zIndex={200}>
        <Button variant="primary" size="medium" icon={SparklesIcon} iconPosition="left">
          Ask AI
        </Button>
      </Box>

    </Box>
  );
}
