/**
 * The single registry of admin destinations.
 *
 * Both the sidebar and the ⌘K palette read from this file, which is the point:
 * a new admin page becomes reachable from both surfaces by adding one entry,
 * and the two can never drift out of sync.
 *
 * Destinations are split into **workspaces** rather than listed flat. The admin
 * had grown past ~18 links in six groups, which is a wall of text you have to
 * read top-to-bottom to navigate. The two workspaces reflect a real division in
 * the job — publishing the public site vs. operating the platform — so each one
 * shows about eight links, and the palette covers the rare cross-workspace jump.
 */

import {
  Bell,
  Building,
  Calculator,
  Calendar,
  ChatBubbleEmpty,
  Clock,
  CloudDownload,
  CreditCard,
  Database,
  HeadsetHelp,
  Journal,
  Key,
  Link as LinkIcon,
  MapPin,
  Mail,
  ShieldXmark,
  Page,
  Quote,
  MoneySquare,
  Shield,
  Suitcase,
  User,
  ViewGrid,
  Wallet,
} from 'iconoir-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Extra words the palette matches on but the sidebar never shows. */
  keywords?: string[];
  exact?: boolean;
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface Workspace {
  id: string;
  label: string;
  /** One line explaining what belongs here, shown in the switcher. */
  description: string;
  icon: React.ElementType;
  groups: NavGroup[];
  /** Hidden from non-ADMIN editors. */
  adminOnly?: boolean;
}

export const DASHBOARD: NavItem = {
  href: '/admin',
  label: 'Dashboard',
  icon: ViewGrid,
  exact: true,
  keywords: ['overview', 'home', 'metrics'],
};

export const WORKSPACES: Workspace[] = [
  {
    id: 'marketing',
    label: 'Marketing Site',
    description: 'Everything the public sees, and everything they send back.',
    icon: Page,
    groups: [
      {
        id: 'site',
        title: 'Website',
        items: [
          { href: '/admin/pages', label: 'Page Content', icon: Page, keywords: ['home', 'sections', 'cms', 'copy'] },
          { href: '/admin/links', label: 'Navigation & Footer', icon: LinkIcon, keywords: ['menu', 'nav'] },
          { href: '/admin/legal', label: 'Legal Pages', icon: Shield, keywords: ['terms', 'privacy', 'policy'] },
        ],
      },
      {
        id: 'content',
        title: 'Content',
        items: [
          { href: '/admin/blog', label: 'Blog Posts', icon: Journal, keywords: ['articles', 'writing'] },
          { href: '/admin/testimonials', label: 'Testimonials', icon: Quote, keywords: ['reviews', 'social proof'] },
          { href: '/admin/careers', label: 'Careers', icon: Suitcase, keywords: ['jobs', 'hiring', 'applications'] },
        ],
      },
      {
        id: 'inbox',
        title: 'Inbox',
        items: [
          { href: '/admin/messages', label: 'Communications', icon: Mail, keywords: ['contact', 'enquiries'] },
          { href: '/admin/support', label: 'Support', icon: HeadsetHelp, keywords: ['tickets', 'piq'] },
          { href: '/admin/concierge', label: 'Concierge', icon: ChatBubbleEmpty, keywords: ['chatbot', 'leads'] },
          {
            href: '/admin/kitchen-calculator',
            label: 'Kitchen Calculator',
            icon: Calculator,
            keywords: ['roi', 'assessment', 'leads', 'intelligence score'],
          },
          { href: '/admin/meetings', label: 'Meetings', icon: Calendar, keywords: ['demos', 'calls'] },
        ],
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    description: 'Tenants, billing, and the machinery that runs the product.',
    icon: Database,
    adminOnly: true,
    groups: [
      {
        id: 'tenants',
        title: 'Tenants',
        items: [
          {
            href: '/admin/organizations',
            label: 'Organizations',
            icon: Building,
            keywords: ['tenants', 'orgs', 'customers', 'companies'],
          },
          {
            href: '/admin/branches',
            label: 'Branches',
            icon: MapPin,
            keywords: ['locations', 'sites', 'kitchens', 'outlets'],
          },
          {
            href: '/admin/accounts',
            label: 'User Accounts',
            icon: User,
            keywords: ['people', 'customers', 'logins', 'impersonate', 'suspend'],
          },
        ],
      },
      {
        id: 'commercial',
        title: 'Commercial',
        items: [
          { href: '/admin/subscriptions', label: 'Subscription Plans', icon: CreditCard, keywords: ['pricing', 'plans', 'billing'] },
          {
            href: '/admin/payments',
            label: 'Offline Payments',
            icon: MoneySquare,
            keywords: ['bank transfer', 'mobile money', 'proof', 'manual', 'cash', 'approve', 'receipt'],
          },
          { href: '/admin/payment-gateways', label: 'Payment Gateways', icon: Wallet, keywords: ['stripe', 'flutterwave', 'checkout'] },
        ],
      },
      {
        id: 'connector',
        title: 'PIQ Connector',
        items: [
          { href: '/admin/connectors', label: 'Machines', icon: Database, keywords: ['pos', 'sync', 'agents'] },
          {
            href: '/admin/ops-alerts',
            label: 'Ops Alerts',
            icon: Bell,
            keywords: ['pos sync failed', 'connector offline', 'csv stale', 'infra', 'incidents'],
          },
          { href: '/admin/releases', label: 'Releases', icon: CloudDownload, keywords: ['versions', 'updates'] },
          { href: '/admin/installation-tokens', label: 'Install Tokens', icon: Key, keywords: ['setup', 'provisioning'] },
        ],
      },
      {
        id: 'system',
        title: 'System',
        items: [
          { href: '/admin/users', label: 'Admin Staff', icon: Shield, keywords: ['team', 'editors', 'permissions', 'panel access'] },
          { href: '/admin/activity', label: 'Activity Log', icon: Clock, keywords: ['audit', 'history', 'trail'] },
          {
            href: '/admin/suppressed-emails',
            label: 'Email Deliverability',
            icon: ShieldXmark,
            keywords: ['bounce', 'bounced', 'spam', 'complaint', 'suppression', 'blocklist', 'resend', 'undeliverable'],
          },
        ],
      },
    ],
  },
];

export function visibleWorkspaces(isAdmin: boolean): Workspace[] {
  return WORKSPACES.filter((workspace) => !workspace.adminOnly || isAdmin);
}

export function isItemActive(pathname: string, item: NavItem): boolean {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Which workspace owns the current URL. Longest-prefix wins so
 * `/admin/users` (Admin Staff) never loses to a shorter sibling.
 */
export function workspaceForPath(
  pathname: string,
  workspaces: Workspace[],
): Workspace | null {
  let best: { workspace: Workspace; length: number } | null = null;
  for (const workspace of workspaces) {
    for (const group of workspace.groups) {
      for (const item of group.items) {
        if (isItemActive(pathname, item) && item.href.length > (best?.length ?? 0)) {
          best = { workspace, length: item.href.length };
        }
      }
    }
  }
  return best?.workspace ?? null;
}

/**
 * Where "switch to this workspace" should land you.
 *
 * A workspace is not itself a page, so selecting one has to navigate somewhere.
 * The first item of the first group is the workspace's front door — Page
 * Content for Marketing, Organizations for Platform.
 */
export function firstDestination(workspace: Workspace): NavItem | null {
  for (const group of workspace.groups) {
    if (group.items.length > 0) return group.items[0];
  }
  return null;
}

export interface FlatDestination extends NavItem {
  workspaceId: string;
  workspaceLabel: string;
  groupTitle: string;
}

/** Every destination as one list — what the palette searches. */
export function flattenDestinations(workspaces: Workspace[]): FlatDestination[] {
  const rows: FlatDestination[] = [
    {
      ...DASHBOARD,
      workspaceId: 'overview',
      workspaceLabel: 'Overview',
      groupTitle: 'Overview',
    },
  ];
  for (const workspace of workspaces) {
    for (const group of workspace.groups) {
      for (const item of group.items) {
        rows.push({
          ...item,
          workspaceId: workspace.id,
          workspaceLabel: workspace.label,
          groupTitle: group.title,
        });
      }
    }
  }
  return rows;
}
