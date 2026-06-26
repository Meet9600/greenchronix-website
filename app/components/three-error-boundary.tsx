"use client";

import React, { type ReactNode } from "react";

interface ThreeErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ThreeErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary that catches runtime errors thrown by R3F / Three.js components.
 * When an error is caught, renders `fallback` (e.g. StaticNetworkFallback) or null,
 * keeping the rest of the page fully operational.
 *
 * Validates: Requirement 7.9
 */
export default class ThreeErrorBoundary extends React.Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  state: ThreeErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_error: Error): ThreeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("ThreeErrorBoundary caught:", error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
