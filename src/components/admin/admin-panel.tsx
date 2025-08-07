'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  WalletCards,
  Mail,
  Bot,
  Megaphone,
  Settings,
  Gift,
  Users,
  Activity,
  LayoutDashboard,
  Banknote,
  ArrowUpFromLine,
  GitBranch,
  UserPlus,
  Trophy,
  CreditCard,
  FileText,
  Globe,
  MessageSquare,
  Zap,
  Brain,
  Edit
} from 'lucide-react';
import { WalletManager } from './wallet-manager';
import { SupportChatManager } from './support-chat-manager';
import { BotSettingsManager } from './bot-settings-manager';
import { AnnouncementManager } from './announcement-manager';
import { SiteSettingsManager } from './site-settings-manager';
import { VerificationManager } from './verification-manager';
import { PromotionManager } from './promotion-manager';
import { ModeratorManager } from './moderator-manager';
import { ActionLogViewer } from './action-log-viewer';
import { AnalyticsManager } from './analytics/AnalyticsManager';
import { DepositApprovalManager } from './deposit-approval-manager';
import { BotTierSettingsManager } from './bot-tier-settings-manager';
import { WithdrawalManager } from './withdrawal-manager';
import { PublicChatManager } from './public-chat-manager';
import { SquadRewardSettingsManager } from './squad-reward-settings-manager';
import { UserManager } from './user-manager';
import { RewardsManager } from './rewards-manager';
import { SliderImageManager } from './slider-image-manager';
import { DataFetcher } from './data-fetcher';
import { WebPageEditor } from './web-page-editor';

const adminSections = {
    'Dashboard': { component: <AnalyticsManager />, icon: LayoutDashboard },
    'User Management': {
        'Users': { component: <UserManager />, icon: UserPlus },
        'Wallets': { component: <WalletManager />, icon: WalletCards },
        'KYC / UPDATE': { component: <VerificationManager />, icon: Shield },
        'Moderators': { component: <ModeratorManager />, icon: Users },
    },
    'Financial Management': {
        'Deposits': { component: <DepositApprovalManager />, icon: Banknote },
        'Withdrawals': { component: <WithdrawalManager />, icon: ArrowUpFromLine },
        'AstralCore Cards': { component: <WalletManager />, icon: CreditCard },
    },
    'Communication': {
        'Support Messages': { component: <SupportChatManager />, icon: Mail },
        'Public Chat': { component: <PublicChatManager />, icon: MessageSquare },
        'Announcements': { component: <AnnouncementManager />, icon: Megaphone },
    },
    'Content & Engagement': {
        'Promotions': { component: <PromotionManager />, icon: Gift },
        'Rewards System': { component: <RewardsManager />, icon: Trophy },
        'Slider Images': { component: <SliderImageManager />, icon: FileText },
        'Squad & Rewards': { component: <SquadRewardSettingsManager />, icon: GitBranch },
        'Web Page Editor': { component: <WebPageEditor />, icon: Edit },
    },
    'AstralCore Hyperdrive': {
        'Hyperdrive Settings': { component: <BotTierSettingsManager />, icon: Brain },
        'Trading Bot Config': { component: <BotSettingsManager />, icon: Bot },
        'Neural Networks': { component: <BotSettingsManager />, icon: Zap },
    },
    'System Management': {
        'General Settings': { component: <SiteSettingsManager />, icon: Settings },
        'Action Logs': { component: <ActionLogViewer />, icon: Activity },
        'Platform Analytics': { component: <AnalyticsManager />, icon: LayoutDashboard },
        'Data Management': { component: <DataFetcher />, icon: Globe },
    }
} as const;

type AdminView = keyof (typeof adminSections)['User Management'] | 
                 keyof (typeof adminSections)['Financial Management'] |
                 keyof (typeof adminSections)['Communication'] |
                 keyof (typeof adminSections)['Content & Engagement'] |
                 keyof (typeof adminSections)['AstralCore Hyperdrive'] |
                 keyof (typeof adminSections)['System Management'] |
                 'Dashboard';

export function AdminPanel() {
    const [activeView, setActiveView] = React.useState<AdminView>('Dashboard');

    const renderContent = () => {
        if (activeView === 'Dashboard') {
            return adminSections.Dashboard.component;
        }
        for (const section of Object.values(adminSections)) {
            if (typeof section === 'object' && activeView in section) {
                 // @ts-ignore
                return section[activeView].component;
            }
        }
        return null;
    };

    const getActiveSection = () => {
        if (activeView === 'Dashboard') return 'Dashboard';
        for (const [sectionName, section] of Object.entries(adminSections)) {
            if (typeof section === 'object' && activeView in section) {
                return sectionName;
            }
        }
        return 'Dashboard';
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <Card className="mb-6 bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-xl border border-blue-400/30">
                            <Shield className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-white flex items-center gap-2">
                                <Brain className="h-6 w-6 text-purple-400" />
                                AstralCore Hyperdrive Admin Panel
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Advanced administration for quantum trading platform
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Enhanced Sidebar */}
                <Card className="lg:col-span-1 bg-black/40 backdrop-blur-xl border-border/40">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings className="h-5 w-5 text-blue-400" />
                            Admin Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {Object.entries(adminSections).map(([sectionName, section]) => {
                            if (sectionName === 'Dashboard') {
                                const IconComponent = section.icon;
                                return (
                                    <Button
                                        key={sectionName}
                                        variant={activeView === 'Dashboard' ? 'default' : 'ghost'}
                                        className={`w-full justify-start text-left ${
                                            activeView === 'Dashboard' 
                                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400' 
                                                : 'hover:bg-white/5'
                                        }`}
                                        onClick={() => setActiveView('Dashboard')}
                                    >
                                        <IconComponent className="mr-3 h-4 w-4" />
                                        {sectionName}
                                    </Button>
                                );
                            } else {
                                const currentSection = getActiveSection();
                                const isSectionActive = currentSection === sectionName;
                                
                                return (
                                    <div key={sectionName} className="space-y-1">
                                        <div className={`text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-3 ${
                                            isSectionActive ? 'text-blue-400' : ''
                                        }`}>
                                            {sectionName}
                                        </div>
                                        {Object.entries(section).map(([itemName, item]) => {
                                            const IconComponent = item.icon;
                                            const isActive = activeView === itemName;
                                            return (
                                                <Button
                                                    key={itemName}
                                                    variant={isActive ? 'default' : 'ghost'}
                                                    className={`w-full justify-start text-left text-sm ${
                                                        isActive 
                                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400' 
                                                            : 'hover:bg-white/5 text-gray-300'
                                                    }`}
                                                    onClick={() => setActiveView(itemName as AdminView)}
                                                >
                                                    <IconComponent className="mr-3 h-4 w-4" />
                                                    {itemName}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                );
                            }
                        })}
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                        <CardContent className="p-6">
                            {renderContent()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
