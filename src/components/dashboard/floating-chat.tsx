"use client"

import * as React from "react"
import { X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicChatView } from "./public-chat-view"
import { AnimatePresence, motion } from "framer-motion"
import { AstralLogo } from "../icons/astral-logo"

export function FloatingChat() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false)
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleMinimize = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }
  
  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  if (!isClient) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            drag
            dragConstraints={{ left: 8, right: window.innerWidth - 32 - 384, top: 8, bottom: window.innerHeight - 32 - 600 }} // Adjust constraints for window size
            dragMomentum={false}
            dragListener={false} // We'll use a drag handle
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[600px] flex flex-col rounded-lg shadow-2xl border bg-card/50 backdrop-blur-xl"
          >
            <motion.div
                onPointerDown={(e) => {
                    // This allows dragging only from the header
                    const target = e.target as HTMLElement;
                    if (target.closest('button')) return;
                    (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
                    const dragControls = (e.currentTarget.parentElement as any).dragControls;
                    dragControls?.start(e);
                }}
                onPointerUp={(e) => {
                    (e.currentTarget as HTMLElement).style.cursor = 'grab';
                }}
                className="flex justify-between items-center p-2 rounded-t-lg border-b border-border cursor-grab"
            >
                <h3 className="font-semibold ml-2 text-foreground">Public Chat</h3>
                <div>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMinimize}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
            <div className="flex-1 overflow-hidden rounded-b-lg">
                <PublicChatView isFloating />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.div
          drag
          dragConstraints={{ left: 8, right: window.innerWidth - 72, top: 8, bottom: window.innerHeight - 72 }}
          dragMomentum={false}
          className="fixed bottom-4 right-4 z-50 cursor-grab active:cursor-grabbing"
          initial={{ bottom: 16, right: 16 }}
        >
          <Button
            onClick={handleToggle}
            className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
          >
            <AstralLogo className="h-8 w-8" />
            <span className="sr-only">Open Chat</span>
          </Button>
        </motion.div>
      )}
    </>
  )
}
