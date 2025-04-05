// lib/edgestore.ts
"use client";
import { createEdgeStoreProvider } from "@edgestore/react";
import type { EdgeStoreRouter } from "@/types/edgestore";

// Create provider with proper type isolation
const { EdgeStoreProvider, useEdgeStore } = createEdgeStoreProvider<EdgeStoreRouter>();
export { EdgeStoreProvider, useEdgeStore };