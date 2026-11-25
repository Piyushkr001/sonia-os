"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Compass,
  GitBranch,
  Network,
  Lightbulb,
  Sparkles,
  Menu,
  Search,
  Command as CommandIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";
import { trackEngagement } from "@/lib/analytics";

const navLinks = [
  {
    title: "Explore",
    href: "#explore",
    icon: Compass,
  },
  {
    title: "Journey",
    href: "#journey",
    icon: GitBranch,
  },
  {
    title: "Expertise",
    href: "#expertise",
    icon: Network,
  },
  {
    title: "Ideas",
    href: "#ideas",
    icon: Lightbulb,
  },
  {
    title: "Ask AI",
    href: "#ai",
    icon: Sparkles,
  },
];

function Navbar() {
  const [activeSection, setActiveSection] = useState("#explore");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Detect scrolling and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = [
        ...navLinks.map((link) => link.href),
        "#connect",
      ];

      let currentSection = "#explore";

      for (const href of sections) {
        const section = document.querySelector(href);

        if (
          section &&
          section.getBoundingClientRect().top <= 150
        ) {
          currentSection = href;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key?.toLowerCase() === "k" &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setCommandOpen((previous) => !previous);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // Record navigation once, using the existing consent-aware provider.
  const recordNavigation = (href: string) => {
    trackEngagement("navigation_click", href.slice(1));
  };

  const handleNavigation = (href: string) => {
    recordNavigation(href);
    setActiveSection(href);
    setMobileOpen(false);
    setCommandOpen(false);

    if (window.location.hash === href) {
      document.getElementById(href.slice(1))?.scrollIntoView({
        block: "start",
      });
    } else {
      window.location.hash = href;
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-3 z-50 w-full px-4",
          "transition-all duration-300"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center",
            "justify-between gap-4 rounded-2xl",
            "border border-white/10",
            "bg-[#080C10]/90 backdrop-blur-xl",
            "px-4 sm:px-6",
            "text-slate-100 shadow-lg",
            "transition-all duration-300",
            scrolled
              ? "h-16 border-emerald-400/20"
              : "h-20"
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/#explore"
            aria-label="SONIA.OS Home"
            onClick={() => recordNavigation("#explore")}
            className="flex shrink-0 items-center"
          >
            <Image
              src="/Images/logo.svg"
              alt="SONIA.OS"
              width={170}
              height={50}
              preload
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  activeSection === link.href
                    ? "location"
                    : undefined
                }
                onClick={() => {
                  recordNavigation(link.href);
                  setActiveSection(link.href);
                }}
                className={cn(
                  "relative flex items-center gap-2",
                  "rounded-lg px-3 py-2",
                  "font-sans text-sm font-medium",
                  "transition-all duration-200",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-400",
                  activeSection === link.href
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            {/* Command Palette Trigger */}
            <Button
              variant="outline"
              aria-label="Open command palette"
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
              onClick={() => setCommandOpen(true)}
              className={cn(
                "flex items-center gap-2",
                "border-white/10 bg-white/5",
                "text-slate-400",
                "hover:bg-white/10 hover:text-white"
              )}
            >
              <CommandIcon className="size-3.5" />

              <span className="font-mono text-xs">
                K
              </span>
            </Button>

            {/* Connect CTA */}
            <Button
              onClick={() =>
                handleNavigation("#connect")
              }
              className={cn(
                "group rounded-xl",
                "bg-emerald-400 font-semibold",
                "text-slate-950",
                "hover:bg-emerald-300",
                "transition-all duration-300"
              )}
            >
              Let&apos;s Connect

              <ArrowUpRight
                className={cn(
                  "size-4 transition-transform",
                  "group-hover:translate-x-0.5",
                  "group-hover:-translate-y-0.5"
                )}
              />
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search navigation"
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
              onClick={() => setCommandOpen(true)}
              className="text-slate-400 hover:bg-white/5 hover:text-emerald-400"
            >
              <Search className="size-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="text-slate-400 hover:bg-white/5 hover:text-emerald-400"
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sheet */}
      <Sheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      >
        <SheetContent
          side="right"
          className={cn(
            "w-[85vw] max-w-sm",
            "border-white/10",
            "bg-[#080C10] text-slate-100",
            "p-6"
          )}
        >
          <SheetHeader className="items-start p-0">
            <SheetTitle className="text-white">
              <Image
                src="/Images/logo.svg"
                alt="SONIA.OS"
                width={170}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </SheetTitle>

            <SheetDescription className="font-mono text-xs tracking-widest text-slate-400">
              EXPLORE DIGITAL IDENTITY
            </SheetDescription>
          </SheetHeader>

          {/* Mobile Links */}
          <nav
            aria-label="Mobile navigation"
            className="mt-8 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <button
                  key={link.href}
                  type="button"
                  aria-current={
                    activeSection === link.href
                      ? "location"
                      : undefined
                  }
                  onClick={() =>
                    handleNavigation(link.href)
                  }
                  className={cn(
                    "flex w-full items-center",
                    "justify-between rounded-xl",
                    "px-4 py-4 text-left",
                    "transition-colors duration-200",
                    activeSection === link.href
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-5" />

                    <span className="font-medium">
                      {link.title}
                    </span>
                  </span>

                  <ArrowUpRight className="size-4" />
                </button>
              );
            })}
          </nav>

          {/* Mobile Connect Button */}
          <div className="mt-auto flex flex-col gap-4">
            <Button
              onClick={() =>
                handleNavigation("#connect")
              }
              className={cn(
                "h-12 w-full rounded-xl",
                "bg-emerald-400 font-semibold",
                "text-slate-950",
                "hover:bg-emerald-300"
              )}
            >
              Let&apos;s Connect
              <ArrowUpRight className="size-4" />
            </Button>

            <p className="text-center font-mono text-xs text-slate-500">
              SONIA.OS // BEYOND THE PROFILE
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Command Palette */}
      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        className="border border-emerald-400/20 bg-[#121A20] text-slate-100"
      >
        <Command className="bg-[#121A20] text-slate-100">
          <CommandInput placeholder="Explore SONIA.OS..." />

          <CommandList>
            <CommandEmpty>
              No matching sections found.
            </CommandEmpty>

            <CommandGroup heading="Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <CommandItem
                    key={link.href}
                    value={link.title}
                    onSelect={() =>
                      handleNavigation(link.href)
                    }
                  >
                    <Icon className="mr-2 size-4" />

                    <span>{link.title}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            <CommandGroup heading="Connect">
              <CommandItem
                value="Let's Connect"
                onSelect={() =>
                  handleNavigation("#connect")
                }
              >
                <ArrowUpRight className="mr-2 size-4" />

                <span>Let&apos;s Connect</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export default Navbar;
