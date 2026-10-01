import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Idea, IdeaType, PrerequisiteLink } from '../types';
import {
  Plus,
  Trash2,
  Edit3,
  Link2,
  Crown,
  Zap,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Lightbulb,
  Wand2,
  GripHorizontal,
  RefreshCw,
  Target,
  Network,
  Sparkles,
  Lock,
  Unlock,
  Undo2,
  Redo2,
  Grid,
  Image as ImageIcon,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Layers,
  Search,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  ExternalLink,
  Tag,
  Palette,
  Upload,
  ArrowLeft
} from 'lucide-react';

interface IdeaNetworkViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
  onOpenLinkPrereq: (idea: Idea) => void;
  onUpdateIdeas?: (updatedIdeas: Idea[]) => void;
  focusedIdeaId?: string | null;
  onBackToCommons?: () => void;
}

// Canvas Card Types (Thunder Notebook inspired: Idea, Text, Note, Image)
export type CanvasCardType = 'idea' | 'text' | 'note' | 'image';

export interface CanvasCardItem {
  id: string;
  type: CanvasCardType;
  x: number;
  y: number;
  width: number;
  height: number;
  isLocked?: boolean;
  color?: 'amber' | 'sky' | 'emerald' | 'purple' | 'rose' | 'neutral';
  // If type === 'idea', references an existing idea in the repository
  ideaId?: string;
  // If type === 'text' | 'note' | 'image'
  title?: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  noteSectionRef?: 'motivation' | 'feasibility' | 'alternatives' | 'skills' | 'custom';
}

export interface CanvasConnection {
  id: string;
  fromId: string;
  toId: string;
  fromPort?: 'top' | 'right' | 'bottom' | 'left';
  toPort?: 'top' | 'right' | 'bottom' | 'left';
  label: '🔓 Unlocks' | '🔒 Blocks / Requires' | '⚡ Bridges' | string;
  isLocked: boolean;
}

export interface IdeaCanvasState {
  ideaId: string;
  ideaTitle: string;
  cards: CanvasCardItem[];
  connections: CanvasConnection[];
  transform: { x: number; y: number; scale: number };
}

const STORAGE_IDEA_PREFIX = 'thunder_canvas_idea_v9_';
const DEFAULT_CARD_WIDTH = 280;
const DEFAULT_CARD_HEIGHT = 150;
const GRID_SIZE = 20;

// Helper functions for 4-way Anchor Ports (Top, Right, Bottom, Left)
export const getPortCoordinates = (
  card: { x: number; y: number; width: number; height: number },
  port: 'top' | 'right' | 'bottom' | 'left' = 'right'
) => {
  switch (port) {
    case 'top':
      return { x: card.x + card.width / 2, y: card.y };
    case 'right':
      return { x: card.x + card.width, y: card.y + card.height / 2 };
    case 'bottom':
      return { x: card.x + card.width / 2, y: card.y + card.height };
    case 'left':
      return { x: card.x, y: card.y + card.height / 2 };
  }
};

export const getBezierPath = (
  sx: number,
  sy: number,
  sPort: 'top' | 'right' | 'bottom' | 'left' = 'right',
  tx: number,
  ty: number,
  tPort: 'top' | 'right' | 'bottom' | 'left' = 'left'
) => {
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.hypot(dx, dy);
  const curvature = Math.min(Math.max(dist * 0.45, 35), 160);

  let c1x = sx;
  let c1y = sy;
  if (sPort === 'right') c1x += curvature;
  else if (sPort === 'left') c1x -= curvature;
  else if (sPort === 'bottom') c1y += curvature;
  else if (sPort === 'top') c1y -= curvature;

  let c2x = tx;
  let c2y = ty;
  if (tPort === 'right') c2x += curvature;
  else if (tPort === 'left') c2x -= curvature;
  else if (tPort === 'bottom') c2y += curvature;
  else if (tPort === 'top') c2y -= curvature;

  return `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tx} ${ty}`;
};

export const getClosestPort = (
  card: { x: number; y: number; width: number; height: number },
  cursor: { x: number; y: number }
): 'top' | 'right' | 'bottom' | 'left' => {
  const ports: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];
  let closestPort: 'top' | 'right' | 'bottom' | 'left' = 'left';
  let minDist = Infinity;
  for (const p of ports) {
    const pt = getPortCoordinates(card, p);
    const d = Math.hypot(cursor.x - pt.x, cursor.y - pt.y);
    if (d < minDist) {
      minDist = d;
      closestPort = p;
    }
  }
  return closestPort;
};

export const IdeaNetworkView: React.FC<IdeaNetworkViewProps> = ({
  ideas,
  onSelectIdea,
  onOpenLinkPrereq,
  onUpdateIdeas,
  focusedIdeaId,
  onBackToCommons,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 750 });

  // Map of ideas for instant lookup
  const ideaMap = useMemo(() => new Map(ideas.map((i) => [i.id, i])), [ideas]);

  // ACTIVE IDEA: The specific idea whose dedicated canvas is open
  const [activeIdeaId, setActiveIdeaId] = useState<string>(() => {
    if (focusedIdeaId && ideaMap.has(focusedIdeaId)) return focusedIdeaId;
    return 'problem-medical-nfc-card';
  });

  const activeIdea = useMemo(() => {
    return ideaMap.get(activeIdeaId) || ideas[0];
  }, [activeIdeaId, ideaMap, ideas]);

  // Left Note Drawer / Palette toggle (Thunder Notebook style)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Canvas Transform (Pan & Zoom)
  const [transform, setTransform] = useState({ x: 120, y: 70, scale: 0.88 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Canvas Cards & Connections for the current idea
  const [cards, setCards] = useState<CanvasCardItem[]>([]);
  const [connections, setConnections] = useState<CanvasConnection[]>([]);

  // Snap to Grid state
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // Undo / Redo History Stack
  const historyRef = useRef<{
    past: Array<{ cards: CanvasCardItem[]; connections: CanvasConnection[] }>;
    future: Array<{ cards: CanvasCardItem[]; connections: CanvasConnection[] }>;
  }>({ past: [], future: [] });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Push current canvas state to history before a mutating action
  const pushHistory = useCallback(() => {
    historyRef.current.past.push({
      cards: JSON.parse(JSON.stringify(cards)),
      connections: JSON.parse(JSON.stringify(connections)),
    });
    if (historyRef.current.past.length > 30) {
      historyRef.current.past.shift();
    }
    historyRef.current.future = [];
    setCanUndo(true);
    setCanRedo(false);
  }, [cards, connections]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyRef.current.past.length === 0) return;
    const previous = historyRef.current.past.pop()!;
    historyRef.current.future.push({
      cards: JSON.parse(JSON.stringify(cards)),
      connections: JSON.parse(JSON.stringify(connections)),
    });
    setCards(previous.cards);
    setConnections(previous.connections);
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(true);
    setFeedbackToast('Undo applied');
  }, [cards, connections]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyRef.current.future.length === 0) return;
    const next = historyRef.current.future.pop()!;
    historyRef.current.past.push({
      cards: JSON.parse(JSON.stringify(cards)),
      connections: JSON.parse(JSON.stringify(connections)),
    });
    setCards(next.cards);
    setConnections(next.connections);
    setCanUndo(true);
    setCanRedo(historyRef.current.future.length > 0);
    setFeedbackToast('Redo applied');
  }, [cards, connections]);

  // Active selections
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // Live Wire Connection State
  const [wireSourceCardId, setWireSourceCardId] = useState<string | null>(null);
  const [wireSourcePort, setWireSourcePort] = useState<'top' | 'right' | 'bottom' | 'left'>('right');
  const [wireCursor, setWireCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isConnectMode, setIsConnectMode] = useState<boolean>(false);

  // Modals & Panels
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CanvasCardItem | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Card Resizing State
  const [resizingCardId, setResizingCardId] = useState<string | null>(null);

  // File input ref for photo uploads
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss toast feedback
  useEffect(() => {
    if (feedbackToast) {
      const t = setTimeout(() => setFeedbackToast(null), 3200);
      return () => clearTimeout(t);
    }
  }, [feedbackToast]);

  // Screen to Canvas coordinate conversion (Zoom & Pan Aware)
  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - transform.x) / transform.scale,
        y: (clientY - rect.top - transform.y) / transform.scale,
      };
    },
    [transform]
  );

  // EXACT CENTER OF CURRENT USER SCREEN VIEWPORT (IN CANVAS COORDINATES)
  // Ensures newly added text cards, notes, or uploaded photos appear dead-center
  // in whichever coordinates the user is currently panning and looking at!
  const getCanvasCenter = useCallback(
    (cardWidth = DEFAULT_CARD_WIDTH, cardHeight = DEFAULT_CARD_HEIGHT) => {
      if (!containerRef.current) {
        return {
          x: Math.round((-transform.x + 400) / transform.scale),
          y: Math.round((-transform.y + 300) / transform.scale),
        };
      }
      const rect = containerRef.current.getBoundingClientRect();
      // Center of the visible container element converted into canvas coordinates
      const centerCanvasX = (rect.width / 2 - transform.x) / transform.scale;
      const centerCanvasY = (rect.height / 2 - transform.y) / transform.scale;

      let x = centerCanvasX - cardWidth / 2;
      let y = centerCanvasY - cardHeight / 2;

      if (snapToGrid) {
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;
      } else {
        x = Math.round(x);
        y = Math.round(y);
      }

      return { x, y };
    },
    [transform, snapToGrid]
  );

  // ========================================================
  // PER-IDEA CANVAS PERSISTENCE: LOAD & INITIALIZE
  // Every idea gets its own dedicated Canvas!
  // ========================================================
  const initializeIdeaCanvas = useCallback(
    (targetIdeaId: string) => {
      // 1. Try loading existing saved canvas for this idea
      try {
        const raw = localStorage.getItem(`${STORAGE_IDEA_PREFIX}${targetIdeaId}`);
        if (raw) {
          const parsed: IdeaCanvasState = JSON.parse(raw);
          if (parsed.cards && parsed.cards.length > 0) {
            setCards(parsed.cards);
            setConnections(parsed.connections || []);
            if (parsed.transform) setTransform(parsed.transform);
            setSelectedCardId(`card-${targetIdeaId}`);
            return;
          }
        }
      } catch (e) {
        console.error('Error loading per-idea canvas:', e);
      }

      // 2. Generate initial dedicated canvas for this idea
      const rootIdea = ideaMap.get(targetIdeaId) || ideas[0];
      const initialCards: CanvasCardItem[] = [];
      const initialConns: CanvasConnection[] = [];

      // A. Centerpiece Card: The Target Idea (Amber or Sky)
      const rootCardId = `card-${rootIdea.id}`;
      initialCards.push({
        id: rootCardId,
        type: 'idea',
        ideaId: rootIdea.id,
        x: 480,
        y: 200,
        width: DEFAULT_CARD_WIDTH,
        height: DEFAULT_CARD_HEIGHT,
        color: rootIdea.type === 'problem' ? 'amber' : 'sky',
        isLocked: false,
      });

      // B. Upstream Prerequisites (what this idea requires to be built)
      const prereqIds = rootIdea.prerequisites.map((p) => p.targetId).filter((id) => ideaMap.has(id));
      prereqIds.forEach((pId, idx) => {
        const pIdea = ideaMap.get(pId)!;
        const pCardId = `card-${pIdea.id}`;
        initialCards.push({
          id: pCardId,
          type: 'idea',
          ideaId: pIdea.id,
          x: 100,
          y: 100 + idx * 180,
          width: DEFAULT_CARD_WIDTH,
          height: DEFAULT_CARD_HEIGHT,
          color: 'emerald',
          isLocked: false,
        });

        initialConns.push({
          id: `conn-${pIdea.id}-${rootIdea.id}`,
          fromId: pCardId,
          toId: rootCardId,
          fromPort: 'right',
          toPort: 'left',
          label: '🔓 Unlocks',
          isLocked: false,
        });
      });

      // C. Downstream Systems (what this idea unlocks)
      const downstreamIdeas = ideas.filter((i) => i.prerequisites.some((p) => p.targetId === rootIdea.id));
      downstreamIdeas.forEach((dIdea, idx) => {
        const dCardId = `card-${dIdea.id}`;
        initialCards.push({
          id: dCardId,
          type: 'idea',
          ideaId: dIdea.id,
          x: 880,
          y: 100 + idx * 180,
          width: DEFAULT_CARD_WIDTH,
          height: DEFAULT_CARD_HEIGHT,
          color: 'sky',
          isLocked: false,
        });

        initialConns.push({
          id: `conn-${rootIdea.id}-${dIdea.id}`,
          fromId: rootCardId,
          toId: dCardId,
          fromPort: 'right',
          toPort: 'left',
          label: '🔓 Unlocks',
          isLocked: false,
        });
      });

      // D. Architecture & Friction Note Spec Card (Thunder Notebook Note style)
      initialCards.push({
        id: `note-spec-${targetIdeaId}`,
        type: 'note',
        title: `${rootIdea.title.slice(0, 32)} Spec`,
        content: `• Problem Statement: ${rootIdea.motivation.problemStatement.slice(0, 95)}...\n• Technical Stack: ${rootIdea.feasibility.suggestedStack.slice(0, 3).join(', ')}\n• First Milestone: ${rootIdea.feasibility.firstStep.slice(0, 75)}...`,
        tags: [rootIdea.category.split('&')[0].trim(), 'System Note'],
        noteSectionRef: 'motivation',
        x: 480,
        y: 400,
        width: DEFAULT_CARD_WIDTH,
        height: 160,
        color: 'purple',
        isLocked: false,
      });

      setCards(initialCards);
      setConnections(initialConns);
      setTransform({ x: 90, y: 50, scale: 0.85 });
      setSelectedCardId(rootCardId);
    },
    [ideas, ideaMap]
  );

  // Initialize canvas whenever activeIdeaId changes
  useEffect(() => {
    initializeIdeaCanvas(activeIdeaId);
  }, [activeIdeaId, initializeIdeaCanvas]);

  // Sync focusedIdeaId prop
  useEffect(() => {
    if (focusedIdeaId && ideaMap.has(focusedIdeaId)) {
      setActiveIdeaId(focusedIdeaId);
      setFeedbackToast(`Switched to Canvas for "${ideaMap.get(focusedIdeaId)?.title}"`);
    }
  }, [focusedIdeaId, ideaMap]);

  // Save current idea's canvas state to localStorage
  const saveCurrentIdeaCanvas = useCallback(
    (updatedCards = cards, updatedConns = connections, updatedTransform = transform) => {
      const state: IdeaCanvasState = {
        ideaId: activeIdeaId,
        ideaTitle: activeIdea.title,
        cards: updatedCards,
        connections: updatedConns,
        transform: updatedTransform,
      };
      try {
        localStorage.setItem(`${STORAGE_IDEA_PREFIX}${activeIdeaId}`, JSON.stringify(state));
      } catch (e) {
        console.error('Error saving per-idea canvas state:', e);
      }
    },
    [cards, connections, transform, activeIdeaId, activeIdea]
  );

  // Auto-save on card or connection changes
  useEffect(() => {
    if (cards.length > 0) {
      saveCurrentIdeaCanvas(cards, connections, transform);
    }
  }, [cards, connections, transform, saveCurrentIdeaCanvas]);

  // Window resize observer
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewportSize({
          width: Math.max(rect.width, 320),
          height: Math.max(rect.height, 480),
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // FIT TO SCREEN: Frame all canvas objects visible
  const handleFitToScreen = useCallback(() => {
    if (cards.length === 0) return;
    const minX = Math.min(...cards.map((c) => c.x));
    const maxX = Math.max(...cards.map((c) => c.x + c.width));
    const minY = Math.min(...cards.map((c) => c.y));
    const maxY = Math.max(...cards.map((c) => c.y + c.height));

    const contentW = maxX - minX + 240;
    const contentH = maxY - minY + 240;

    const scaleX = viewportSize.width / contentW;
    const scaleY = viewportSize.height / contentH;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.25);

    const fitX = (viewportSize.width - contentW * fitScale) / 2 - (minX - 120) * fitScale;
    const fitY = (viewportSize.height - contentH * fitScale) / 2 - (minY - 120) * fitScale;

    setTransform({ x: fitX, y: fitY, scale: fitScale });
    setFeedbackToast('Fitted all cards to screen');
  }, [cards, viewportSize]);

  // AUTO-ARRANGE CLEAN DAG FOR THIS IDEA
  const handleAutoArrange = () => {
    pushHistory();
    const updated = cards.map((c) => ({ ...c }));

    const rootCard = updated.find((c) => c.type === 'idea' && c.ideaId === activeIdeaId);
    if (rootCard) {
      rootCard.x = 480;
      rootCard.y = 200;
    }

    const upCards = updated.filter(
      (c) => c !== rootCard && connections.some((cn) => cn.fromId === c.id && cn.toId === rootCard?.id)
    );
    upCards.forEach((c, i) => {
      c.x = 100;
      c.y = 100 + i * 185;
    });

    const downCards = updated.filter(
      (c) => c !== rootCard && connections.some((cn) => cn.fromId === rootCard?.id && cn.toId === c.id)
    );
    downCards.forEach((c, i) => {
      c.x = 880;
      c.y = 100 + i * 185;
    });

    const otherCards = updated.filter(
      (c) => c !== rootCard && !upCards.includes(c) && !downCards.includes(c)
    );
    otherCards.forEach((c, i) => {
      c.x = 480;
      c.y = 400 + i * 190;
    });

    setCards(updated);
    setFeedbackToast('Arranged cards into clean DAG hierarchy');
    setTimeout(() => handleFitToScreen(), 50);
  };

  // ========================================================
  // BUTTER-SMOOTH DRAGGING (POINTER EVENTS)
  // Window listeners ensure drags NEVER drop or glitch
  // ========================================================
  const handleCardPointerDown = (card: CanvasCardItem, e: React.PointerEvent) => {
    if (card.isLocked) return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('.connection-port') || target.closest('.resize-handle')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setSelectedCardId(card.id);
    setSelectedEdgeId(null);

    const startCanvas = screenToCanvas(e.clientX, e.clientY);
    const offset = {
      x: startCanvas.x - card.x,
      y: startCanvas.y - card.y,
    };

    let hasMoved = false;

    const onPointerMove = (moveEvent: PointerEvent) => {
      hasMoved = true;
      const currentCanvas = screenToCanvas(moveEvent.clientX, moveEvent.clientY);
      let newX = currentCanvas.x - offset.x;
      let newY = currentCanvas.y - offset.y;

      if (snapToGrid) {
        newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
        newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
      }

      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, x: Math.round(newX), y: Math.round(newY) } : c))
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (hasMoved) {
        pushHistory();
        saveCurrentIdeaCanvas();
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // CARD RESIZING HANDLER (Bottom-right corner)
  const handleResizePointerDown = (card: CanvasCardItem, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startCanvas = screenToCanvas(e.clientX, e.clientY);
    const initialWidth = card.width;
    const initialHeight = card.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const currentCanvas = screenToCanvas(moveEvent.clientX, moveEvent.clientY);
      const dw = currentCanvas.x - startCanvas.x;
      const dh = currentCanvas.y - startCanvas.y;

      let newW = Math.max(200, Math.round(initialWidth + dw));
      let newH = Math.max(120, Math.round(initialHeight + dh));

      if (snapToGrid) {
        newW = Math.round(newW / GRID_SIZE) * GRID_SIZE;
        newH = Math.round(newH / GRID_SIZE) * GRID_SIZE;
      }

      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, width: newW, height: newH } : c))
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      pushHistory();
      saveCurrentIdeaCanvas();
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // ========================================================
  // CANVAS PAN & ZOOM (Centered at Cursor)
  // ========================================================
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      setSelectedCardId(null);
      setSelectedEdgeId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      }));
    }

    if (wireSourceCardId) {
      const pt = screenToCanvas(e.clientX, e.clientY);
      setWireCursor(pt);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (!isConnectMode && wireSourceCardId) {
      setWireSourceCardId(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.25), 2.4);
    const scaleRatio = newScale / transform.scale;

    setTransform({
      x: mouseX - (mouseX - transform.x) * scaleRatio,
      y: mouseY - (mouseY - transform.y) * scaleRatio,
      scale: newScale,
    });
  };

  // ========================================================
  // INJECT SECTIONS FROM ACTIVE IDEA AS NOTE CARDS
  // (Directly implements Thunder Notebook note referencing!)
  // ========================================================
  const handleInjectIdeaNote = (section: 'motivation' | 'feasibility' | 'alternatives' | 'skills') => {
    pushHistory();
    const center = screenToCanvas(viewportSize.width / 2, viewportSize.height / 2);

    let title = '';
    let content = '';
    let color: CanvasCardItem['color'] = 'purple';
    let tags: string[] = [];

    if (section === 'motivation') {
      title = `${activeIdea.title.slice(0, 28)} Problem Spec`;
      content = `• The Problem: ${activeIdea.motivation.problemStatement}\n• The Gap: ${activeIdea.motivation.theGap}\n• Impact: ${activeIdea.motivation.impactIfSolved}`;
      color = 'amber';
      tags = ['Motivation', 'Ground Truth'];
    } else if (section === 'feasibility') {
      title = `Feasibility & Tech Stack`;
      content = `• Assessment: ${activeIdea.feasibility.assessment}\n• Suggested Stack: ${activeIdea.feasibility.suggestedStack.join(', ')}\n• First Milestone: ${activeIdea.feasibility.firstStep}`;
      color = 'sky';
      tags = ['Engineering', 'Stack'];
    } else if (section === 'alternatives') {
      title = `Alternatives & Shortcomings`;
      content = `• Why They Fall Short: ${activeIdea.existingSolutions.whyTheyFallShort}\n• Existing: ${activeIdea.existingSolutions.alternatives.map((a) => a.name).join(', ')}`;
      color = 'rose';
      tags = ['Market Analysis', 'Benchmark'];
    } else {
      title = `Builder Skills Needed`;
      content = activeIdea.skillsNeeded.map((s) => `• ${s.skill}: ${s.roleDescription}`).join('\n');
      color = 'emerald';
      tags = ['Team Formation', 'Roles'];
    }

    const pos = getCanvasCenter(DEFAULT_CARD_WIDTH, 175);
    const newCard: CanvasCardItem = {
      id: `note-${section}-${Date.now().toString(36)}`,
      type: 'note',
      title,
      content,
      tags,
      noteSectionRef: section,
      x: pos.x,
      y: pos.y,
      width: DEFAULT_CARD_WIDTH,
      height: 175,
      color,
      isLocked: false,
    };

    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    setFeedbackToast(`Added "${title}" Note Card to the middle of your screen!`);
  };

  // ADD TEXT CARD (Appears in center of current screen coordinates)
  const handleAddTextCard = () => {
    pushHistory();
    const pos = getCanvasCenter(DEFAULT_CARD_WIDTH, DEFAULT_CARD_HEIGHT);
    const newCard: CanvasCardItem = {
      id: `text-${Date.now().toString(36)}`,
      type: 'text',
      title: 'Freeform Concept Note',
      content: 'Click edit to record open architectural questions, protocol specs, or field research observations.',
      x: pos.x,
      y: pos.y,
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
      color: 'emerald',
      isLocked: false,
    };
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    setFeedbackToast('Added Text Card to the middle of your screen!');
  };

  // ADD NOTE CARD (Appears in center of current screen coordinates)
  const handleAddNoteCard = () => {
    pushHistory();
    const pos = getCanvasCenter(DEFAULT_CARD_WIDTH, 160);
    const newCard: CanvasCardItem = {
      id: `note-${Date.now().toString(36)}`,
      type: 'note',
      title: 'Prerequisite Spec',
      content: `• Input requirements\n• Expected system output\n• Fault tolerance edge-cases`,
      tags: ['Prerequisite', 'Specification'],
      x: pos.x,
      y: pos.y,
      width: DEFAULT_CARD_WIDTH,
      height: 160,
      color: 'purple',
      isLocked: false,
    };
    setCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
    setFeedbackToast('Added Note Card to the middle of your screen!');
  };

  // UPLOAD PHOTO (Replaces preset diagrams, places photo in center of screen coordinates)
  const handleTriggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      pushHistory();
      const pos = getCanvasCenter(320, 220);
      const newCard: CanvasCardItem = {
        id: `photo-${Date.now().toString(36)}`,
        type: 'image',
        title: file.name.replace(/\.[^/.]+$/, ''),
        content: `Uploaded photo (${(file.size / 1024).toFixed(0)} KB)`,
        imageUrl: dataUrl,
        x: pos.x,
        y: pos.y,
        width: 320,
        height: 220,
        color: 'sky',
        isLocked: false,
      };

      setCards((prev) => [...prev, newCard]);
      setSelectedCardId(newCard.id);
      setFeedbackToast('Photo uploaded directly to the middle of your screen!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // CARD LOCK / UNLOCK TOGGLE
  const handleToggleCardLock = (cardId: string) => {
    pushHistory();
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const next = !c.isLocked;
          setFeedbackToast(next ? 'Card locked in place' : 'Card unlocked for editing');
          return { ...c, isLocked: next };
        }
        return c;
      })
    );
  };

  // DELETE CARD
  const handleDeleteCard = (cardId: string) => {
    pushHistory();
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    setConnections((prev) => prev.filter((cn) => cn.fromId !== cardId && cn.toId !== cardId));
    if (selectedCardId === cardId) setSelectedCardId(null);
    setFeedbackToast('Deleted card');
  };

  // ========================================================
  // CONNECTIONS: CONNECT, DISCONNECT, LOCK/UNLOCK LABEL
  // ========================================================
  const handleConnectCards = (fromId: string, toId: string, fromPort?: 'top' | 'right' | 'bottom' | 'left', toPort?: 'top' | 'right' | 'bottom' | 'left') => {
    if (!fromId || !toId || fromId === toId) return;

    const exists = connections.some(
      (c) => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );
    if (exists) {
      setFeedbackToast('Cards are already connected!');
      return;
    }

    pushHistory();
    const newConn: CanvasConnection = {
      id: `conn-${Date.now().toString(36)}`,
      fromId,
      toId,
      fromPort: fromPort || 'right',
      toPort: toPort || 'left',
      label: '🔓 Unlocks',
      isLocked: false,
    };
    setConnections((prev) => [...prev, newConn]);

    // Also sync with idea prerequisites if both are idea cards
    const fromCard = cards.find((c) => c.id === fromId);
    const toCard = cards.find((c) => c.id === toId);
    if (fromCard?.ideaId && toCard?.ideaId && onUpdateIdeas) {
      const updatedIdeas = ideas.map((i) => {
        if (i.id === toCard.ideaId) {
          const alreadyLinked = i.prerequisites.some((p) => p.targetId === fromCard.ideaId);
          if (!alreadyLinked) {
            return {
              ...i,
              prerequisites: [
                ...i.prerequisites,
                { targetId: fromCard.ideaId!, relationship: 'prerequisite_for' as const, note: 'Unlocks' },
              ],
            };
          }
        }
        return i;
      });
      onUpdateIdeas(updatedIdeas);
    }

    setFeedbackToast('✓ Connected cards with dependency arrow');
  };

  // SEVER CONNECTION (Clean Disconnect)
  const handleSeverConnection = (connId: string) => {
    const conn = connections.find((c) => c.id === connId);
    if (!conn) return;

    pushHistory();
    setConnections((prev) => prev.filter((c) => c.id !== connId));

    const fromCard = cards.find((c) => c.id === conn.fromId);
    const toCard = cards.find((c) => c.id === conn.toId);
    if (fromCard?.ideaId && toCard?.ideaId && onUpdateIdeas) {
      const updatedIdeas = ideas.map((i) => {
        if (i.id === toCard.ideaId) {
          return {
            ...i,
            prerequisites: i.prerequisites.filter((p) => p.targetId !== fromCard.ideaId),
          };
        }
        return i;
      });
      onUpdateIdeas(updatedIdeas);
    }

    setSelectedEdgeId(null);
    setFeedbackToast('✓ Severed connection wire');
  };

  // TOGGLE CONNECTION LOCK / RELATIONSHIP LABEL
  const handleToggleConnectionLabel = (connId: string) => {
    pushHistory();
    setConnections((prev) =>
      prev.map((c) => {
        if (c.id === connId) {
          let nextLabel: CanvasConnection['label'] = '🔓 Unlocks';
          let nextLocked = false;

          if (c.label === '🔓 Unlocks') {
            nextLabel = '🔒 Blocks / Requires';
            nextLocked = true;
          } else if (c.label === '🔒 Blocks / Requires') {
            nextLabel = '⚡ Bridges';
            nextLocked = false;
          } else {
            nextLabel = '🔓 Unlocks';
            nextLocked = false;
          }

          setFeedbackToast(`Connection set to: ${nextLabel}`);
          return {
            ...c,
            label: nextLabel,
            isLocked: nextLocked,
          };
        }
        return c;
      })
    );
  };

  // ========================================================
  // BEZIER WIRES COMPUTATION WITH EXACT 4-WAY ANCHOR MIDPOINTS
  // ========================================================
  const cardMap = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

  const computedEdges = useMemo(() => {
    return connections
      .filter((cn) => cardMap.has(cn.fromId) && cardMap.has(cn.toId))
      .map((cn) => {
        const src = cardMap.get(cn.fromId)!;
        const tgt = cardMap.get(cn.toId)!;

        // Auto-detect cleanest ports if not explicitly defined
        let fromPort = cn.fromPort;
        let toPort = cn.toPort;

        if (!fromPort || !toPort) {
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;

          if (Math.abs(dx) >= Math.abs(dy)) {
            fromPort = fromPort || (dx >= 0 ? 'right' : 'left');
            toPort = toPort || (dx >= 0 ? 'left' : 'right');
          } else {
            fromPort = fromPort || (dy >= 0 ? 'bottom' : 'top');
            toPort = toPort || (dy >= 0 ? 'top' : 'bottom');
          }
        }

        // Calculate exact port anchor coordinates
        const srcPt = getPortCoordinates(src, fromPort);
        const tgtPt = getPortCoordinates(tgt, toPort);
        const sx = srcPt.x;
        const sy = srcPt.y;
        const tx = tgtPt.x;
        const ty = tgtPt.y;

        const pathData = getBezierPath(sx, sy, fromPort, tx, ty, toPort);

        const isLocked = cn.isLocked || cn.label.includes('🔒') || cn.label.includes('Blocks');
        const color = isLocked ? '#f43f5e' : cn.label.includes('Bridges') ? '#38bdf8' : '#10b981';

        return {
          ...cn,
          fromPort,
          toPort,
          sourceX: sx,
          sourceY: sy,
          targetX: tx,
          targetY: ty,
          midX: (sx + tx) / 2,
          midY: (sy + ty) / 2,
          pathData,
          color,
          isLocked,
        };
      });
  }, [connections, cardMap]);

  // Keyboard Shortcuts: Undo (Ctrl+Z), Redo (Ctrl+Shift+Z), Delete (Backspace)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedCardId) {
          e.preventDefault();
          handleDeleteCard(selectedCardId);
        } else if (selectedEdgeId) {
          e.preventDefault();
          handleSeverConnection(selectedEdgeId);
        }
      } else if (e.key === 'Escape') {
        setSelectedCardId(null);
        setSelectedEdgeId(null);
        setWireSourceCardId(null);
        setIsConnectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCardId, selectedEdgeId, handleUndo, handleRedo]);

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden select-none bg-[#0c0c0e] font-sans flex">
      {/* ======================================================== */}
      {/* LEFT DRAWER: THUNDER NOTEBOOK PALETTE                    */}
      {/* Allows injecting notes, specs, and diagrams for THIS idea */}
      {/* ======================================================== */}
      <aside
        className={`h-full border-r border-neutral-800 bg-[#121216]/95 backdrop-blur-xl z-40 transition-all duration-200 flex flex-col shrink-0 ${
          isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden border-r-0'
        }`}
      >
        <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Thunder Canvas</h3>
              <p className="text-[10px] text-neutral-400 truncate">Notes & Specs for this Idea</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Note Sections for this Idea */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Inject Notes From This Idea
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleInjectIdeaNote('motivation')}
                className="w-full text-left p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all group"
              >
                <div className="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>Problem & Gap Note</span>
                  </span>
                  <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                  {activeIdea.motivation.problemStatement}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInjectIdeaNote('feasibility')}
                className="w-full text-left p-2 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all group"
              >
                <div className="flex items-center justify-between text-sky-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Tech Stack & Milestones</span>
                  </span>
                  <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                  {activeIdea.feasibility.suggestedStack.join(', ')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInjectIdeaNote('alternatives')}
                className="w-full text-left p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all group"
              >
                <div className="flex items-center justify-between text-rose-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5" />
                    <span>Alternatives Shortcomings</span>
                  </span>
                  <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                  {activeIdea.existingSolutions.whyTheyFallShort}
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleInjectIdeaNote('skills')}
                className="w-full text-left p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all group"
              >
                <div className="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Skills & Builder Roster</span>
                  </span>
                  <Plus className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                  {activeIdea.skillsNeeded.map((s) => s.skill).join(' · ')}
                </p>
              </button>
            </div>
          </div>

          {/* Create Custom Notes & Cards */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Custom Notes & Spec
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleAddTextCard}
                className="w-full text-left p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-emerald-400/20 text-emerald-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-emerald-300 font-bold text-[11px]">+ Freeform Text Note</div>
                    <div className="text-[9.5px] text-neutral-400">Design note & hypothesis</div>
                  </div>
                </div>
                <Plus className="h-3.5 w-3.5 text-emerald-400 opacity-70 group-hover:opacity-100" />
              </button>

              <button
                type="button"
                onClick={handleAddNoteCard}
                className="w-full text-left p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-purple-400/20 text-purple-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-purple-300 font-bold text-[11px]">+ Custom Spec Note</div>
                    <div className="text-[9.5px] text-neutral-400">Bullet requirements checklist</div>
                  </div>
                </div>
                <Plus className="h-3.5 w-3.5 text-purple-400 opacity-70 group-hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Upload Photos & Media */}
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Photos & Media
            </div>
            <button
              type="button"
              onClick={handleTriggerPhotoUpload}
              className="w-full text-left p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-sky-400/20 text-sky-400">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sky-300 font-bold text-[11px]">Upload Photo to Canvas</div>
                  <div className="text-[9.5px] text-neutral-400">Add any image from device</div>
                </div>
              </div>
              <Plus className="h-3.5 w-3.5 text-sky-400 opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 border-t border-neutral-800/80 text-[10px] text-neutral-500 flex items-center justify-between">
          <span>Per-Idea Canvas</span>
          <span className="text-amber-400 font-mono">Thunder v9</span>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CANVAS AREA                                         */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleWheel}
        className="relative flex-1 h-full overflow-hidden select-none bg-[#0c0c0e]"
        style={{
          backgroundImage: snapToGrid
            ? `radial-gradient(circle, #272730 1.5px, transparent 1.5px)`
            : `radial-gradient(circle, #1c1c22 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE * transform.scale}px ${GRID_SIZE * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
          cursor: isPanning ? 'grabbing' : 'default',
        }}
      >
        {/* Toggle Sidebar Button (if closed) */}
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-40 p-2 rounded-xl border border-neutral-800 bg-[#141418]/95 text-neutral-300 hover:text-white shadow-2xl backdrop-blur-xl"
            title="Open Note Palette"
          >
            <PanelLeftOpen className="h-4 w-4 text-amber-400" />
          </button>
        )}

        {/* ======================================================== */}
        {/* TOP HEADER: PER-IDEA SELECTOR & CANVAS CONTROLS          */}
        {/* ======================================================== */}
        <div
          className={`absolute top-4 ${
            !isSidebarOpen ? 'left-16' : 'left-4'
          } right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none transition-all`}
        >
          {/* Left: Back to Commons + Idea Canvas Selector */}
          <div className="flex items-center gap-2 pointer-events-auto bg-[#141418]/95 border border-neutral-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
            {onBackToCommons && (
              <button
                type="button"
                onClick={onBackToCommons}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-amber-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Return to Idea Commons Grid"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Commons</span>
              </button>
            )}

            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider hidden sm:inline">
                Idea Canvas:
              </span>
              <select
                value={activeIdeaId}
                onChange={(e) => {
                  setActiveIdeaId(e.target.value);
                  setFeedbackToast(`Switched to Canvas for "${ideaMap.get(e.target.value)?.title}"`);
                }}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[190px] sm:max-w-[300px] md:max-w-[380px] truncate"
              >
                {ideas.map((i) => (
                  <option key={i.id} value={i.id} className="bg-neutral-900 text-white py-1">
                    {i.type === 'problem' ? '🚨 [Problem]' : '💡 [Solution]'} {i.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 pl-1 border-l border-neutral-800">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-1.5 rounded-lg transition-colors ${
                  canUndo ? 'text-neutral-300 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-1.5 rounded-lg transition-colors ${
                  canRedo ? 'text-neutral-300 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>

            {/* Snap to Grid Toggle */}
            <button
              type="button"
              onClick={() => {
                setSnapToGrid(!snapToGrid);
                setFeedbackToast(snapToGrid ? 'Grid Snap Disabled' : 'Grid Snap Enabled (20px)');
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                snapToGrid ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-neutral-400 hover:text-white'
              }`}
              title="Toggle Grid Snapping"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Grid Snap</span>
            </button>

            {/* Auto Arrange DAG */}
            <button
              type="button"
              onClick={handleAutoArrange}
              className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Auto-align cards into clean DAG hierarchy for this idea"
            >
              <Wand2 className="h-3.5 w-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CANVAS WORLD: SVG LAYER & CARDS (Zoom & Pan Transform)   */}
        {/* ======================================================== */}
        <div
          className="absolute inset-0 pointer-events-none origin-top-left"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {/* SVG LAYER: Directional Bezier Arrows & Markers */}
          <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow-green" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#10b981" />
              </marker>
              <marker id="arrow-rose" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#f43f5e" />
              </marker>
              <marker id="arrow-sky" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#38bdf8" />
              </marker>
              <marker id="arrow-white" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
                <polygon points="0 1, 8 4, 0 7" fill="#ffffff" />
              </marker>
            </defs>

            {/* Visible Connections */}
            {computedEdges.map((edge) => {
              const isSelected = selectedEdgeId === edge.id;
              const isHovered = hoveredEdgeId === edge.id;
              const strokeColor = isSelected ? '#ffffff' : edge.color;

              return (
                <g
                  key={edge.id}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeId(isSelected ? null : edge.id);
                    setSelectedCardId(null);
                  }}
                >
                  <path
                    d={edge.pathData}
                    fill="none"
                    stroke="rgba(0,0,0,0.001)"
                    strokeWidth="24"
                    pointerEvents="stroke"
                  />

                  <path
                    d={edge.pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3.5 : isHovered ? 3 : 2}
                    strokeDasharray={edge.isLocked ? '5,4' : undefined}
                    opacity={isSelected ? 1 : isHovered ? 1 : 0.85}
                    markerEnd={`url(#${
                      isSelected ? 'arrow-white' : edge.isLocked ? 'arrow-rose' : edge.color === '#38bdf8' ? 'arrow-sky' : 'arrow-green'
                    })`}
                    className="transition-all duration-150"
                    pointerEvents="none"
                  />

                  {!edge.isLocked && (
                    <circle r="2.8" fill={edge.color} pointerEvents="none">
                      <animateMotion dur="2.4s" repeatCount="indefinite" path={edge.pathData} />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* LIVE DRAGGING WIRE */}
            {wireSourceCardId && cardMap.has(wireSourceCardId) && (
              (() => {
                const src = cardMap.get(wireSourceCardId)!;
                const srcPt = getPortCoordinates(src, wireSourcePort);
                const sx = srcPt.x;
                const sy = srcPt.y;

                const dx = wireCursor.x - sx;
                const dy = wireCursor.y - sy;
                const dist = Math.hypot(dx, dy);
                const curvature = Math.min(Math.max(dist * 0.45, 30), 140);

                let c1x = sx;
                let c1y = sy;
                if (wireSourcePort === 'right') c1x += curvature;
                else if (wireSourcePort === 'left') c1x -= curvature;
                else if (wireSourcePort === 'bottom') c1y += curvature;
                else if (wireSourcePort === 'top') c1y -= curvature;

                return (
                  <path
                    d={`M ${sx} ${sy} Q ${c1x} ${c1y}, ${wireCursor.x} ${wireCursor.y}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4,4"
                    markerEnd="url(#arrow-green)"
                  />
                );
              })()
            )}
          </svg>

          {/* ======================================================== */}
          {/* INTERACTIVE CONNECTION PILL: LOCK/UNLOCK LABEL + SEVER   */}
          {/* ======================================================== */}
          {computedEdges.map((edge) => {
            return (
              <div
                key={`pill-${edge.id}`}
                className="absolute z-40 pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900/95 px-2.5 py-1 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
                style={{ left: edge.midX, top: edge.midY }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* LOCK / UNLOCK TOGGLE & RELATIONSHIP LABEL */}
                <button
                  type="button"
                  onClick={() => handleToggleConnectionLabel(edge.id)}
                  className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                    edge.isLocked
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                  title="Click to toggle Lock/Unlock status & label"
                >
                  {edge.isLocked ? <Lock className="h-3 w-3 text-rose-400" /> : <Unlock className="h-3 w-3 text-emerald-400" />}
                  <span>{edge.label}</span>
                </button>

                <div className="h-3 w-px bg-neutral-700 mx-0.5" />

                {/* SEVER WIRE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleSeverConnection(edge.id)}
                  className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 hover:text-rose-400 hover:bg-rose-950/60 px-1.5 py-0.5 rounded-full transition-colors cursor-pointer"
                  title="Sever this dependency connection"
                >
                  <X className="h-3 w-3 text-rose-400" />
                  <span>Sever</span>
                </button>
              </div>
            );
          })}

          {/* ======================================================== */}
          {/* CANVAS CARDS FOR THIS IDEA                               */}
          {/* ======================================================== */}
          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            const isHovered = hoveredCardId === card.id;
            const isWireSource = wireSourceCardId === card.id;
            const refIdea = card.type === 'idea' && card.ideaId ? ideaMap.get(card.ideaId) : null;
            const isRootIdea = card.type === 'idea' && card.ideaId === activeIdeaId;

            // Border & Glow based on type and lock state
            let borderClass = 'border-neutral-800 bg-[#141418] hover:border-neutral-600';
            let glowStyle: React.CSSProperties = {};

            if (isRootIdea) {
              borderClass = 'border-amber-400/90 bg-[#181611] ring-2 ring-amber-400/80 shadow-2xl';
              glowStyle = { boxShadow: '0 0 35px rgba(245, 158, 11, 0.3)' };
            } else if (card.color === 'amber' || refIdea?.type === 'problem') {
              borderClass = 'border-amber-500/70 bg-[#161410]';
            } else if (card.color === 'emerald') {
              borderClass = 'border-emerald-500/60 bg-[#101612]';
            } else if (card.color === 'purple' || card.type === 'note') {
              borderClass = 'border-purple-500/60 bg-[#141118]';
            } else if (card.color === 'sky' || card.type === 'image') {
              borderClass = 'border-sky-500/60 bg-[#101418]';
            }

            if (isSelected) {
              borderClass += ' ring-2 ring-white shadow-2xl';
            } else if (isWireSource) {
              borderClass += ' ring-2 ring-emerald-400 animate-pulse';
            }

            return (
              <div
                key={card.id}
                className={`canvas-card absolute pointer-events-auto rounded-2xl border transition-shadow duration-150 select-none flex flex-col justify-between ${
                  card.isLocked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
                } ${borderClass}`}
                style={{
                  left: `${card.x}px`,
                  top: `${card.y}px`,
                  width: `${card.width}px`,
                  height: `${card.height}px`,
                  ...glowStyle,
                }}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onPointerDown={(e) => handleCardPointerDown(card, e)}
                onMouseUp={(e) => {
                  if (wireSourceCardId && wireSourceCardId !== card.id) {
                    e.stopPropagation();
                    const targetPort = getClosestPort(card, wireCursor);
                    handleConnectCards(wireSourceCardId, card.id, wireSourcePort, targetPort);
                    setWireSourceCardId(null);
                    setIsConnectMode(false);
                  }
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingCard(card);
                  setIsQuickEditOpen(true);
                }}
              >
                {/* ======================================================== */}
                {/* CARD TOOLBAR (Appears on Hover or Selection)             */}
                {/* ======================================================== */}
                {(isHovered || isSelected) && (
                  <div
                    className="absolute -top-10 left-2 z-50 flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-900/95 px-2 py-1 shadow-2xl backdrop-blur-md pointer-events-auto animate-in fade-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* LOCK / UNLOCK CARD BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleToggleCardLock(card.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        card.isLocked ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                      title={card.isLocked ? 'Card is Locked (Click to Unlock)' : 'Lock Card Position'}
                    >
                      {card.isLocked ? <Lock className="h-3.5 w-3.5 text-amber-400" /> : <Unlock className="h-3.5 w-3.5" />}
                    </button>

                    <div className="h-3.5 w-px bg-neutral-800" />

                    {/* WIRE BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setWireSourceCardId(card.id);
                        setWireSourcePort('right');
                        setIsConnectMode(true);
                        setFeedbackToast('Click the target card to connect');
                      }}
                      className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-950 transition-colors"
                      title="Connect wire to another card"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </button>

                    {/* EDIT CARD */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCard(card);
                        setIsQuickEditOpen(true);
                      }}
                      className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="Edit card details"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {/* If not active idea, allow jumping to its dedicated canvas */}
                    {card.type === 'idea' && card.ideaId && card.ideaId !== activeIdeaId && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveIdeaId(card.ideaId!);
                          setFeedbackToast(`Switched to Canvas for "${refIdea?.title}"`);
                        }}
                        className="p-1 rounded-lg text-amber-400 hover:bg-amber-950 transition-colors"
                        title="Open this idea's dedicated canvas"
                      >
                        <Target className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <div className="h-3.5 w-px bg-neutral-800" />

                    {/* DELETE CARD */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950 transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* ======================================================== */}
                {/* CARD HEADER                                              */}
                {/* ======================================================== */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800/80 bg-neutral-900/50 rounded-t-2xl">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isRootIdea ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-amber-400 text-neutral-950">
                        <Crown className="h-3 w-3" />
                        <span>Target Idea</span>
                      </span>
                    ) : card.type === 'idea' ? (
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          refIdea?.type === 'problem' ? 'bg-amber-500/20 text-amber-300' : 'bg-sky-500/20 text-sky-300'
                        }`}
                      >
                        {refIdea?.type === 'problem' ? '🚨 Problem' : '💡 Solution'}
                      </span>
                    ) : card.type === 'note' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300">
                        <BookOpen className="h-2.5 w-2.5" />
                        <span>Note Spec</span>
                      </span>
                    ) : card.type === 'image' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300">
                        <ImageIcon className="h-2.5 w-2.5" />
                        <span>Diagram</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                        <FileText className="h-2.5 w-2.5" />
                        <span>Idea Card</span>
                      </span>
                    )}

                    {card.isLocked && (
                      <span title="Locked">
                        <Lock className="h-3 w-3 text-amber-400" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-neutral-500">
                    <GripHorizontal className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* ======================================================== */}
                {/* CARD BODY ACCORDING TO TYPE                              */}
                {/* ======================================================== */}
                {card.type === 'image' && card.imageUrl ? (
                  <div className="p-2 flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-1">
                      <h5 className="text-[11px] font-bold text-white truncate">{card.title}</h5>
                      <p className="text-[10px] text-neutral-400 truncate">{card.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {card.type === 'idea' ? refIdea?.title || 'Unknown Idea' : card.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed whitespace-pre-line">
                        {card.type === 'idea' ? refIdea?.tagline : card.content}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px] text-neutral-500">
                      {card.type === 'idea' && refIdea ? (
                        <>
                          <span className="text-emerald-400 font-mono font-medium">
                            {refIdea.votes.goodIdea} upvotes
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectIdea(refIdea);
                            }}
                            className="text-neutral-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <span>Spec</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <span>Double-click to edit</span>
                      )}
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* 4-WAY ANCHOR PORTS: TOP, RIGHT, BOTTOM, LEFT             */}
                {/* ======================================================== */}
                {/* Left Port (Emerald) */}
                <div
                  className={`connection-port absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#121216] border-2 border-emerald-400 hover:scale-150 cursor-crosshair z-30 transition-all shadow-md flex items-center justify-center ${
                    wireSourceCardId ? 'ring-4 ring-emerald-400/40 scale-125' : ''
                  }`}
                  title="Left Port: Drag to start or release to connect"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setWireSourceCardId(card.id);
                    setWireSourcePort('left');
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (wireSourceCardId && wireSourceCardId !== card.id) {
                      handleConnectCards(wireSourceCardId, card.id, wireSourcePort, 'left');
                      setWireSourceCardId(null);
                      setIsConnectMode(false);
                    }
                  }}
                />

                {/* Right Port (Amber) */}
                <div
                  className={`connection-port absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#121216] border-2 border-amber-400 hover:scale-150 cursor-crosshair z-30 transition-all shadow-md flex items-center justify-center ${
                    wireSourceCardId ? 'ring-4 ring-amber-400/40 scale-125' : ''
                  }`}
                  title="Right Port: Drag to start or release to connect"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setWireSourceCardId(card.id);
                    setWireSourcePort('right');
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (wireSourceCardId && wireSourceCardId !== card.id) {
                      handleConnectCards(wireSourceCardId, card.id, wireSourcePort, 'right');
                      setWireSourceCardId(null);
                      setIsConnectMode(false);
                    }
                  }}
                />

                {/* Top Port (Sky Blue) */}
                <div
                  className={`connection-port absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#121216] border-2 border-sky-400 hover:scale-150 cursor-crosshair z-30 transition-all shadow-md flex items-center justify-center ${
                    wireSourceCardId ? 'ring-4 ring-sky-400/40 scale-125' : ''
                  }`}
                  title="Top Port: Drag to start or release to connect"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setWireSourceCardId(card.id);
                    setWireSourcePort('top');
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (wireSourceCardId && wireSourceCardId !== card.id) {
                      handleConnectCards(wireSourceCardId, card.id, wireSourcePort, 'top');
                      setWireSourceCardId(null);
                      setIsConnectMode(false);
                    }
                  }}
                />

                {/* Bottom Port (Purple) */}
                <div
                  className={`connection-port absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-4 w-4 rounded-full bg-[#121216] border-2 border-purple-400 hover:scale-150 cursor-crosshair z-30 transition-all shadow-md flex items-center justify-center ${
                    wireSourceCardId ? 'ring-4 ring-purple-400/40 scale-125' : ''
                  }`}
                  title="Bottom Port: Drag to start or release to connect"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setWireSourceCardId(card.id);
                    setWireSourcePort('bottom');
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (wireSourceCardId && wireSourceCardId !== card.id) {
                      handleConnectCards(wireSourceCardId, card.id, wireSourcePort, 'bottom');
                      setWireSourceCardId(null);
                      setIsConnectMode(false);
                    }
                  }}
                />

                {/* Resize Grip (Bottom-Right) */}
                <div
                  className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize opacity-40 hover:opacity-100 z-30"
                  onPointerDown={(e) => handleResizePointerDown(card, e)}
                  title="Resize Card"
                />
              </div>
            );
          })}
        </div>

        {/* Hidden File Input for Image Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUploadPhoto}
        />

        {/* ======================================================== */}
        {/* ZOOM CONTROLS (Right Side Dock)                          */}
        {/* ======================================================== */}
        <div className="absolute right-4 bottom-5 z-20 flex flex-col items-center gap-1 rounded-2xl border border-neutral-800 bg-[#141418]/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              const nextScale = Math.min(transform.scale * 1.25, 2.4);
              setTransform((p) => ({ ...p, scale: nextScale }));
            }}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const nextScale = Math.max(transform.scale * 0.8, 0.25);
              setTransform((p) => ({ ...p, scale: nextScale }));
            }}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="w-5 h-px bg-neutral-800 my-0.5" />
          <button
            type="button"
            onClick={handleFitToScreen}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* FEEDBACK TOAST                                           */}
        {/* ======================================================== */}
        {feedbackToast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-neutral-700 bg-neutral-900/95 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: EDIT CARD CONTENT                                 */}
        {/* ======================================================== */}
        {isQuickEditOpen && editingCard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsQuickEditOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#16161a] p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-400/20 text-sky-400">
                    <Edit3 className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Edit Canvas Card</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickEditOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  pushHistory();
                  setCards((prev) => prev.map((c) => (c.id === editingCard.id ? editingCard : c)));
                  setIsQuickEditOpen(false);
                  setFeedbackToast('Saved card changes');
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Title</label>
                  <input
                    type="text"
                    required
                    value={editingCard.title || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Content / Specification</label>
                  <textarea
                    rows={4}
                    value={editingCard.content || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, content: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {editingCard.type === 'image' && (
                  <div>
                    <label className="text-xs font-semibold text-neutral-300">Photo URL or Upload</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL or upload..."
                        value={editingCard.imageUrl || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, imageUrl: e.target.value })}
                        className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <label className="px-3 py-2 rounded-xl bg-neutral-800 text-sky-300 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Browse</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const r = new FileReader();
                              r.onload = (ev) => {
                                const du = ev.target?.result as string;
                                if (du) setEditingCard({ ...editingCard, imageUrl: du });
                              };
                              r.readAsDataURL(f);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Color Swatch */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Card Color Tag</label>
                  <div className="mt-1.5 flex items-center gap-2">
                    {(['amber', 'sky', 'emerald', 'purple', 'rose', 'neutral'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditingCard({ ...editingCard, color: c })}
                        className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                          c === 'amber'
                            ? 'bg-amber-400'
                            : c === 'sky'
                            ? 'bg-sky-400'
                            : c === 'emerald'
                            ? 'bg-emerald-400'
                            : c === 'purple'
                            ? 'bg-purple-400'
                            : c === 'rose'
                            ? 'bg-rose-400'
                            : 'bg-neutral-600'
                        } ${editingCard.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsQuickEditOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
