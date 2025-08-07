
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { UsdtLogoIcon } from '../icons/usdt-logo';
import { cn } from '@/lib/utils';
import { CandlestickData } from '@/hooks/use-trading-bot';

const statusMessages = [
    { text: "Connecting to Exchange...", progress: 3 },
    { text: "Analyzing Market...", progress: 15 },
    { text: "Placing Buy Orders...", progress: 30 },
    { text: "Placing Sell Orders...", progress: 45 },
    { text: "Executing Grid...", progress: 70 },
    { text: "Finalizing Grid...", progress: 95 }
];


export function GridTradingAnimation({ totalBalance, profitPerTrade, profitPercentage, setBotLog, isAnimating, candlestickData, currentPrice }: { totalBalance: number, profitPerTrade: number, profitPercentage: number, setBotLog: React.Dispatch<React.SetStateAction<{ message: string; time: Date; }[]>>, isAnimating: boolean, candlestickData: CandlestickData[], currentPrice: number }) {
  const [transactions, setTransactions] = useState<{ id: number; type: string; x: number; y: number; }[]>([]);
  const [statusText, setStatusText] = useState("");
  const chartAreaRef = useRef<HTMLDivElement>(null);
  let transId = 0;

  useEffect(() => {
    if (!isAnimating) {
        setStatusText("");
        return;
    };

    const transactionInterval = setInterval(() => {
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 60 + 20;
      
      setTransactions(currentTransactions => {
        const newTransaction = { id: transId++, type, x, y };
        const updatedTransactions = [...currentTransactions.slice(-20), newTransaction];
        
        setTimeout(() => {
          setTransactions(trs => trs.filter(t => t.id !== newTransaction.id));
        }, 1000);

        return updatedTransactions;
      });

    }, 800);

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        const currentStatus = statusMessages[statusIndex];
        setStatusText(currentStatus.text);
        setBotLog(prev => [...prev, {message: currentStatus.text, time: new Date()}]);

        setTimeout(() => setStatusText(""), 4000); // Display for 4 seconds

        statusIndex++;
        if (statusIndex >= statusMessages.length) {
            clearInterval(statusInterval);
        }
    }, 9000); // Change status every 9 seconds

    return () => {
      clearInterval(transactionInterval);
      clearInterval(statusInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profitPerTrade, totalBalance, isAnimating]);
  
  const chartHeight = chartAreaRef.current?.offsetHeight || 380;

  // FIX: Added a check to ensure candlestickData is not undefined
  if (!candlestickData || candlestickData.length === 0) {
    return (
      <div className="trading-container" ref={chartAreaRef}>
        <div className="grid-levels">
            {[20, 40, 60, 80].map((top, i) => (
                <div key={i} className="grid-line" style={{ top: `${top}%` }}></div>
            ))}
        </div>
      </div>
    );
  }

  const priceData = candlestickData.map(d => [d.high, d.low]).flat();
  const minPrice = Math.min(...priceData, currentPrice);
  const maxPrice = Math.max(...priceData, currentPrice);
  const priceRange = maxPrice - minPrice;

  const getYPosition = (price: number) => {
    if (priceRange === 0) return chartHeight / 2;
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };
  

  return (
    <>
      <div className="trading-container" ref={chartAreaRef}>
         <div className="grid-levels">
            {[20, 40, 60, 80].map((top, i) => (
                <div key={i} className="grid-line" style={{ top: `${top}%` }}></div>
            ))}
        </div>

        {candlestickData.map((candle, index) => {
            const candleTop = getYPosition(candle.high);
            const candleBottom = getYPosition(candle.low);
            const bodyTop = getYPosition(Math.max(candle.open, candle.close));
            const bodyBottom = getYPosition(Math.min(candle.open, candle.close));
            const isBullish = candle.close >= candle.open;

            return (
                 <div key={index} className="candle" style={{ left: `${(index / candlestickData.length) * 100}%`, width: `${100 / candlestickData.length}%` }}>
                    <div className="candle-wick" style={{ top: `${candleTop}px`, height: `${candleBottom - candleTop}px` }}></div>
                    <div className={cn("candle-body", isBullish ? "bullish" : "bearish")} style={{ top: `${bodyTop}px`, height: `${bodyBottom - bodyTop}px` }}></div>
                </div>
            )
        })}

        <div className="price-line" style={{ top: `${getYPosition(currentPrice)}px` }} data-price={currentPrice.toFixed(2)}></div>

        {transactions.map(t => (
          <div key={t.id} className={`transaction ${t.type}`} style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <UsdtLogoIcon className="h-6 w-6"/>
          </div>
        ))}
        {statusText && <div className="dynamic-status">{statusText}</div>}
    </div>
    </>
  );
}
