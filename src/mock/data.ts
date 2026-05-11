export const mockUser = {
  id: "user_8f7d9a2",
  name: "Alexander Cipher",
  email: "alexander.cipher@secure.net",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  securityScore: 98,
  mfaEnabled: true,
  lastLogin: new Date(Date.now() - 3600000).toISOString(),
};

export const mockWallet = {
  totalBalance: 12450.75,
  currency: "USD",
  cards: [
    {
      id: "card_1",
      last4: "4209",
      type: "Visa",
      balance: 8200.00,
      color: "from-blue-600 to-cyan-500",
    },
    {
      id: "card_2",
      last4: "1882",
      type: "Mastercard",
      balance: 4250.75,
      color: "from-emerald-600 to-teal-500",
    }
  ]
};

export const mockTransactions = [
  {
    id: "tx_9f8e7d",
    type: "received",
    amount: 1500.00,
    currency: "USD",
    status: "completed",
    date: new Date(Date.now() - 86400000).toISOString(),
    recipient: "Stripe Payout",
    hash: "0x8f7a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z",
    signature: "HMAC-SHA256:8f9a92...",
  },
  {
    id: "tx_3a2b1c",
    type: "sent",
    amount: -45.99,
    currency: "USD",
    status: "completed",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    recipient: "AWS Web Services",
    hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    signature: "HMAC-SHA256:1a2b3c...",
  },
  {
    id: "tx_5k9m2n",
    type: "sent",
    amount: -125.00,
    currency: "USD",
    status: "pending",
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    recipient: "Vercel Inc.",
    hash: "0x5k9m2n4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    signature: "HMAC-SHA256:5k9m2n...",
  },
  {
    id: "tx_7p1q2r",
    type: "exchange",
    amount: -500.00,
    currency: "USD",
    status: "completed",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    recipient: "ETH Wallet (0x...A1B2)",
    hash: "0x7p1q2r4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    signature: "HMAC-SHA256:7p1q2r...",
  }
];

export const mockLogs = [
  { id: "log_1", action: "Login successful", device: "MacBook Pro (macOS)", ip: "192.168.1.42", status: "success", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "log_2", action: "OTP Verified", device: "iPhone 13 Pro", ip: "192.168.1.100", status: "success", timestamp: new Date(Date.now() - 3660000).toISOString() },
  { id: "log_3", action: "Failed login attempt", device: "Unknown Windows PC", ip: "45.22.11.99", status: "warning", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const mockChartData = [
  { name: 'Jan', received: 4000, sent: 2400 },
  { name: 'Feb', received: 3000, sent: 1398 },
  { name: 'Mar', received: 2000, sent: 9800 },
  { name: 'Apr', received: 2780, sent: 3908 },
  { name: 'May', received: 1890, sent: 4800 },
  { name: 'Jun', received: 2390, sent: 3800 },
  { name: 'Jul', received: 3490, sent: 4300 },
];
