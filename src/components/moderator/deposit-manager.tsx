'use client';

import * as React from 'react';
import {WalletManager} from '../admin/wallet-manager';
import {Card, CardDescription, CardHeader, CardTitle} from '../ui/card';

export function DepositManager() {
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Deposit Management</CardTitle>
          <CardDescription>
            As a moderator, you can credit user accounts after confirming their
            deposits. This tool is similar to the admin wallet manager but focused
            on balance updates.
          </CardDescription>
        </CardHeader>
      </Card>
      <WalletManager />
    </div>
  );
}
