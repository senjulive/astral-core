'use client';

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette, Monitor } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-10 px-4 bg-background/50 backdrop-blur-sm border-white/10"
        disabled
      >
        <Monitor className="h-4 w-4 mr-2 text-gray-400" />
        <span className="hidden sm:inline">Theme</span>
      </Button>
    );
  }

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: Sun,
      color: "text-yellow-500",
      description: "Clean & bright"
    },
    {
      name: "Dark", 
      value: "dark",
      icon: Moon,
      color: "text-blue-400",
      description: "Professional & sleek"
    },
    {
      name: "Purple",
      value: "purple", 
      icon: Palette,
      color: "text-purple-400",
      description: "Royal & elegant"
    },
    {
      name: "System",
      value: "system",
      icon: Monitor,
      color: "text-gray-400",
      description: "Follow system"
    }
  ];

  const getCurrentTheme = () => {
    if (!theme) return themes[1]; // Default to dark theme if no theme is set
    return themes.find(t => t.value === theme) || themes[1];
  };

  const currentTheme = getCurrentTheme();
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80 transition-all duration-300"
        >
          <CurrentIcon className={`h-4 w-4 mr-2 ${currentTheme.color}`} />
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <span className="ml-2 text-xs text-muted-foreground hidden md:inline">
            {currentTheme.description}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-background/95 backdrop-blur-md border-white/10"
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                  : 'hover:bg-accent/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${themeOption.color}`} />
              <div className="flex flex-col flex-1">
                <span className="font-medium">{themeOption.name}</span>
                <span className="text-xs text-muted-foreground">
                  {themeOption.description}
                </span>
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
