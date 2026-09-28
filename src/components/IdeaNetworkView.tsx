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
  Unlink,
  Check,
  Lock,
  Unlock
} from 'lucide-react';

interface IdeaNetworkViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
  onOpenLinkPrereq: (idea: Idea) => void;
  onUpdateIdeas?: (updatedIdeas: Idea[]) => void;
  focusedIdeaId?: string | null;
}

interface CanvasNodeMeta {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: 'amber' | 'sky' | 'emerald' | 'purple' | 'rose' | 'neutral';
}

const STORAGE_NODES_META = 'obsidian_problem_graph_meta_v6';
const DEFAULT_CARD_WIDTH = 275;
const DEFAULT_CARD_HEIGHT = 145;

// Featured problem presets for instant navigation
const FEATURED_PROBLEMS = [
  {
    id: 'problem-medical-nfc-card',
    label: 'Emergency Triage NFC Card',
    icon: '🏥',
  },
  {
    id: 'idea-er-capacity-beacon',
    label: 'ER Surge & Ambulance Beacon',
    icon: '🚑',
  },
  {
    id: 'problem-bakery-food-surplus',
    label: 'Bakery Food Surplus Waste',
    icon: '🥖',
  },
  {
    id: 'problem-civic-noise-grid',
    label: 'Civic Noise Sensor Grid',
    icon: '🔊',
  },
  {
    id: 'problem-right-to-repair-exploded-views',
    label: 'Right-to-Repair Exploded Views',
    icon: '🔧',
  },
];

export const IdeaNetworkView: React.FC<IdeaNetworkViewProps> = ({
  ideas,
  onSelectIdea,
  onOpenLinkPrereq,
  onUpdateIdeas,
  focusedIdeaId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 750 });

  // Map of ideas for instant lookup
  const ideaMap = useMemo(() => new Map(ideas.map((i) => [i.id, i])), [ideas]);

  // ACTIVE TARGET PROBLEM: The specific problem whose dependency graph is being viewed
  const [activeProblemId, setActiveProblemId] = useState<string>(() => {
    if (focusedIdeaId && ideaMap.has(focusedIdeaId)) return focusedIdeaId;
    return 'problem-medical-nfc-card';
  });

  // Scope: 'focused' (only upstream & downstream of active problem) vs 'all' (entire Commons network)
  const [scopeMode, setScopeMode] = useState<'focused' | 'all'>('focused');

  // Canvas Transform (Pan & Zoom)
  const [transform, setTransform] = useState({ x: 80, y: 70, scale: 0.88 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Custom node positions { [id]: { x, y, width, height, color } }
  const [nodesMeta, setNodesMeta] = useState<Record<string, CanvasNodeMeta>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_NODES_META);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Always keep a ref to current nodesMeta to avoid stale closure bugs during drag end
  const nodesMetaRef = useRef<Record<string, CanvasNodeMeta>>(nodesMeta);
  nodesMetaRef.current = nodesMeta;

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number; initialNodeX: number; initialNodeY: number }>({
    clientX: 0,
    clientY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
  });
  const hasMovedDuringDragRef = useRef<boolean>(false);

  // Node Resizing State
  const [resizingNodeId, setResizingNodeId] = useState<string | null>(null);
  const resizeStartRef = useRef<{ clientX: number; clientY: number; width: number; height: number }>({
    clientX: 0,
    clientY: 0,
    width: DEFAULT_CARD_WIDTH,
    height: DEFAULT_CARD_HEIGHT,
  });

  // Selection & Hover States
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // Live Wire Connection State
  // connectingSourceNodeId stores the node where wire begins
  const [connectingSourceNodeId, setConnectingSourceNodeId] = useState<string | null>(null);
  const [connectingPort, setConnectingPort] = useState<'right' | 'left'>('right');
  const [connectionCursor, setConnectionCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isConnectMode, setIsConnectMode] = useState<boolean>(false);

  // Modals & Panels
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [isAddPrereqModalOpen, setIsAddPrereqModalOpen] = useState(false);
  const [addPrereqTargetNodeId, setAddPrereqTargetNodeId] = useState<string | null>(null);
  const [newPrereqTitle, setNewPrereqTitle] = useState('');
  const [newPrereqTagline, setNewPrereqTagline] = useState('');
  const [newPrereqType, setNewPrereqType] = useState<IdeaType>('problem');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Persist nodes meta
  const saveNodesMeta = useCallback((newMeta: Record<string, CanvasNodeMeta>) => {
    setNodesMeta(newMeta);
    nodesMetaRef.current = newMeta;
    try {
      localStorage.setItem(STORAGE_NODES_META, JSON.stringify(newMeta));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Feedback Toast auto-dismiss
  useEffect(() => {
    if (feedbackToast) {
      const t = setTimeout(() => setFeedbackToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [feedbackToast]);

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

  // Sync focusedIdeaId prop with activeProblemId
  useEffect(() => {
    if (focusedIdeaId && ideaMap.has(focusedIdeaId)) {
      setActiveProblemId(focusedIdeaId);
      setSelectedNodeId(focusedIdeaId);
      setFeedbackToast(`Viewing dependency graph for "${ideaMap.get(focusedIdeaId)?.title}"`);
    }
  }, [focusedIdeaId, ideaMap]);

  // Active target idea object
  const activeIdea = useMemo(() => {
    return ideaMap.get(activeProblemId) || ideas[0];
  }, [activeProblemId, ideaMap, ideas]);

  // Convert Screen coordinates to Canvas coordinates
  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;
      return {
        x: (screenX - transform.x) / transform.scale,
        y: (screenY - transform.y) / transform.scale,
      };
    },
    [transform]
  );

  // Compute all edges in the entire system: PREREQUISITE (source) ──► DEPENDENT (target)
  const allEdges = useMemo(() => {
    const list: Array<{
      id: string;
      sourceId: string;
      targetId: string;
      relationship: PrerequisiteLink['relationship'];
      note?: string;
    }> = [];

    ideas.forEach((idea) => {
      idea.prerequisites.forEach((p, idx) => {
        if (ideaMap.has(p.targetId) && p.targetId !== idea.id) {
          list.push({
            id: `edge-${p.targetId}-${idea.id}-${idx}`,
            sourceId: p.targetId,
            targetId: idea.id,
            relationship: p.relationship,
            note: p.note,
          });
        }
      });
    });
    return list;
  }, [ideas, ideaMap]);

  // Compute the Dependency Subtree for the active problem
  const activeProblemLineage = useMemo(() => {
    const targetId = activeIdea?.id || activeProblemId;
    const upstreamPrereqs = new Set<string>();
    const downstreamDependents = new Set<string>();

    const traverseUp = (currId: string) => {
      allEdges.forEach((e) => {
        if (e.targetId === currId && !upstreamPrereqs.has(e.sourceId)) {
          upstreamPrereqs.add(e.sourceId);
          traverseUp(e.sourceId);
        }
      });
    };
    traverseUp(targetId);

    const traverseDown = (currId: string) => {
      allEdges.forEach((e) => {
        if (e.sourceId === currId && !downstreamDependents.has(e.targetId)) {
          downstreamDependents.add(e.targetId);
          traverseDown(e.targetId);
        }
      });
    };
    traverseDown(targetId);

    const relatedNodeIds = new Set<string>([targetId, ...Array.from(upstreamPrereqs), ...Array.from(downstreamDependents)]);
    return {
      targetId,
      upstreamPrereqs,
      downstreamDependents,
      relatedNodeIds,
    };
  }, [activeIdea, activeProblemId, allEdges]);

  // Filter ideas based on scope mode
  const visibleIdeas = useMemo(() => {
    if (scopeMode === 'all') return ideas;
    return ideas.filter((idea) => activeProblemLineage.relatedNodeIds.has(idea.id));
  }, [scopeMode, ideas, activeProblemLineage]);

  // Default clean layout for the specific problem's tree
  const defaultTreeLayout = useMemo(() => {
    const posMap: Record<string, { x: number; y: number }> = {};
    const targetId = activeProblemLineage.targetId;

    const upList = Array.from(activeProblemLineage.upstreamPrereqs);
    const downList = Array.from(activeProblemLineage.downstreamDependents);

    const centerX = 540;
    const centerY = 240;

    // Place Target Problem in the middle
    posMap[targetId] = { x: centerX, y: centerY };

    // Place Upstream Prerequisites to the left in a clean column
    const upSpacing = 175;
    const upStartY = centerY - ((upList.length - 1) * upSpacing) / 2;
    upList.forEach((id, idx) => {
      posMap[id] = {
        x: centerX - 390,
        y: upStartY + idx * upSpacing,
      };
    });

    // Place Downstream Systems to the right in a clean column
    const downSpacing = 175;
    const downStartY = centerY - ((downList.length - 1) * downSpacing) / 2;
    downList.forEach((id, idx) => {
      posMap[id] = {
        x: centerX + 390,
        y: downStartY + idx * downSpacing,
      };
    });

    // Extra ideas if in 'all' mode
    let extraIdx = 0;
    ideas.forEach((idea) => {
      if (!posMap[idea.id]) {
        posMap[idea.id] = {
          x: 120 + (extraIdx % 4) * 330,
          y: 680 + Math.floor(extraIdx / 4) * 190,
        };
        extraIdx++;
      }
    });

    return posMap;
  }, [activeProblemLineage, ideas]);

  // Unified Canvas Nodes list
  const canvasNodes = useMemo(() => {
    return visibleIdeas.map((idea) => {
      const meta = nodesMeta[idea.id];
      const def = defaultTreeLayout[idea.id] || { x: 200, y: 200 };
      const x = meta?.x !== undefined ? meta.x : def.x;
      const y = meta?.y !== undefined ? meta.y : def.y;
      const width = meta?.width || DEFAULT_CARD_WIDTH;
      const height = meta?.height || DEFAULT_CARD_HEIGHT;

      const isTargetProblem = idea.id === activeProblemId;
      const isUpstream = activeProblemLineage.upstreamPrereqs.has(idea.id);
      const isDownstream = activeProblemLineage.downstreamDependents.has(idea.id);

      let defaultColor: CanvasNodeMeta['color'] = 'sky';
      if (isTargetProblem) {
        defaultColor = 'amber';
      } else if (isUpstream) {
        defaultColor = 'emerald';
      } else if (idea.type === 'problem') {
        defaultColor = 'rose';
      }

      const color = meta?.color || defaultColor;

      return {
        id: idea.id,
        idea,
        x,
        y,
        width,
        height,
        color,
        isTargetProblem,
        isUpstream,
        isDownstream,
      };
    });
  }, [visibleIdeas, nodesMeta, defaultTreeLayout, activeProblemId, activeProblemLineage]);

  // Port coordinates calculator for a node
  const getNodePorts = useCallback(
    (nodeId: string) => {
      const node = canvasNodes.find((n) => n.id === nodeId);
      if (!node) {
        return {
          left: { x: 0, y: 0 },
          right: { x: 0, y: 0 },
        };
      }
      return {
        left: { x: node.x, y: node.y + node.height / 2 },
        right: { x: node.x + node.width, y: node.y + node.height / 2 },
      };
    },
    [canvasNodes]
  );

  // Compute visible edges with smooth Bezier paths
  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(canvasNodes.map((n) => n.id));
    const nodeMap = new Map(canvasNodes.map((n) => [n.id, n]));

    return allEdges
      .filter((e) => visibleNodeIds.has(e.sourceId) && visibleNodeIds.has(e.targetId))
      .map((edge) => {
        const src = nodeMap.get(edge.sourceId)!;
        const tgt = nodeMap.get(edge.targetId)!;

        // Source right port -> Target left port
        let sx = src.x + src.width;
        let sy = src.y + src.height / 2;
        let tx = tgt.x;
        let ty = tgt.y + tgt.height / 2;

        if (src.x > tgt.x) {
          // If source is to the right of target, use left -> right
          sx = src.x;
          tx = tgt.x + tgt.width;
        }

        const deltaX = tx - sx;
        const deltaY = ty - sy;
        const cdx = Math.max(Math.abs(deltaX) * 0.5, 45);
        const sign = deltaX > 0 ? 1 : -1;
        const pathData = `M ${sx} ${sy} C ${sx + sign * cdx} ${sy}, ${tx - sign * cdx} ${ty}, ${tx} ${ty}`;

        const isDirectTreeEdge =
          edge.targetId === activeProblemId || edge.sourceId === activeProblemId;
        const isBlocked = edge.relationship === 'blocked_by';

        const color = isBlocked ? '#f59e0b' : '#10b981';

        return {
          ...edge,
          sourceX: sx,
          sourceY: sy,
          targetX: tx,
          targetY: ty,
          midX: (sx + tx) / 2,
          midY: (sy + ty) / 2,
          pathData,
          color,
          isDirectTreeEdge,
          isBlocked,
        };
      });
  }, [allEdges, canvasNodes, activeProblemId]);

  // Fit all nodes into view
  const handleFitView = useCallback(() => {
    if (canvasNodes.length === 0) return;
    const minX = Math.min(...canvasNodes.map((n) => n.x));
    const maxX = Math.max(...canvasNodes.map((n) => n.x + n.width));
    const minY = Math.min(...canvasNodes.map((n) => n.y));
    const maxY = Math.max(...canvasNodes.map((n) => n.y + n.height));

    const contentW = maxX - minX + 220;
    const contentH = maxY - minY + 220;

    const scaleX = viewportSize.width / contentW;
    const scaleY = viewportSize.height / contentH;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.35), 1.2);

    const fitX = (viewportSize.width - contentW * fitScale) / 2 - (minX - 110) * fitScale;
    const fitY = (viewportSize.height - contentH * fitScale) / 2 - (minY - 110) * fitScale;

    setTransform({ x: fitX, y: fitY, scale: fitScale });
    setFeedbackToast('Fitted dependency graph to view');
  }, [canvasNodes, viewportSize]);

  // Reset node positions back to clean tree
  const handleResetToCleanTree = () => {
    const nextMeta = { ...nodesMeta };
    Object.keys(defaultTreeLayout).forEach((id) => {
      delete nextMeta[id];
    });
    saveNodesMeta(nextMeta);
    setFeedbackToast('Reset tree to clean dependency layout');
    setTimeout(() => handleFitView(), 50);
  };

  // PAN HANDLERS
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  };

  // MOUSE MOVE: Handles canvas pan, whole-card drag, card resize, and live wire drawing
  const handleMouseMove = (e: React.MouseEvent) => {
    // 1. Canvas Pan
    if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      }));
      return;
    }

    // 2. Card Drag (Smooth real-time repositioning)
    if (draggingNodeId) {
      hasMovedDuringDragRef.current = true;
      const dx = (e.clientX - dragStartPosRef.current.clientX) / transform.scale;
      const dy = (e.clientY - dragStartPosRef.current.clientY) / transform.scale;

      const newX = Math.round(dragStartPosRef.current.initialNodeX + dx);
      const newY = Math.round(dragStartPosRef.current.initialNodeY + dy);

      setNodesMeta((prev) => {
        const next = {
          ...prev,
          [draggingNodeId]: {
            ...(prev[draggingNodeId] || { width: DEFAULT_CARD_WIDTH, height: DEFAULT_CARD_HEIGHT }),
            x: newX,
            y: newY,
          },
        };
        nodesMetaRef.current = next;
        return next;
      });
      return;
    }

    // 3. Card Resize
    if (resizingNodeId) {
      const dw = (e.clientX - resizeStartRef.current.clientX) / transform.scale;
      const dh = (e.clientY - resizeStartRef.current.clientY) / transform.scale;

      const newW = Math.max(200, Math.round(resizeStartRef.current.width + dw));
      const newH = Math.max(100, Math.round(resizeStartRef.current.height + dh));

      setNodesMeta((prev) => {
        const next = {
          ...prev,
          [resizingNodeId]: {
            ...(prev[resizingNodeId] || { x: 100, y: 100 }),
            width: newW,
            height: newH,
          },
        };
        nodesMetaRef.current = next;
        return next;
      });
      return;
    }

    // 4. Live Wire Drawing
    if (connectingSourceNodeId) {
      const pt = screenToCanvas(e.clientX, e.clientY);
      setConnectionCursor(pt);
    }
  };

  // MOUSE UP: Persists final dragged positions and completes wire drops
  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);

    if (draggingNodeId) {
      setDraggingNodeId(null);
      // Persist permanently using latest ref
      saveNodesMeta(nodesMetaRef.current);
    }

    if (resizingNodeId) {
      setResizingNodeId(null);
      saveNodesMeta(nodesMetaRef.current);
    }

    // Note: Do not clear connectingSourceNodeId if in click-connect mode
    if (!isConnectMode && connectingSourceNodeId) {
      setConnectingSourceNodeId(null);
    }
  };

  // Zoom centered on mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.25), 2.2);
    const scaleRatio = newScale / transform.scale;

    setTransform({
      x: mouseX - (mouseX - transform.x) * scaleRatio,
      y: mouseY - (mouseY - transform.y) * scaleRatio,
      scale: newScale,
    });
  };

  // Switch Active Problem
  const handleSelectActiveProblem = (ideaId: string) => {
    setActiveProblemId(ideaId);
    setSelectedNodeId(ideaId);
    setFeedbackToast(`Switched target problem to "${ideaMap.get(ideaId)?.title || 'Problem'}"`);
  };

  // ========================================================
  // CONNECT TWO NODES: Source Unlocks Target
  // ========================================================
  const handleConnect = useCallback((sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sourceIdea = ideaMap.get(sourceId);
    const targetIdea = ideaMap.get(targetId);
    if (!sourceIdea || !targetIdea) return;

    // Check if target already has source as prerequisite
    const alreadyLinked = targetIdea.prerequisites.some((p) => p.targetId === sourceId);
    if (alreadyLinked) {
      setFeedbackToast(`"${sourceIdea.title}" is already wired to "${targetIdea.title}".`);
      return;
    }

    if (onUpdateIdeas) {
      const updated = ideas.map((i) => {
        if (i.id === targetId) {
          return {
            ...i,
            prerequisites: [
              ...i.prerequisites,
              { targetId: sourceId, relationship: 'prerequisite_for' as const, note: 'Required prerequisite' },
            ],
          };
        }
        return i;
      });
      onUpdateIdeas(updated);
    }

    setFeedbackToast(`✓ Wired: "${sourceIdea.title}" ──► "${targetIdea.title}"`);
  }, [ideas, ideaMap, onUpdateIdeas]);

  // ========================================================
  // DISCONNECT WIRE: Removes link from both directions
  // ========================================================
  const handleDisconnect = useCallback((nodeAId: string, nodeBId: string) => {
    if (!nodeAId || !nodeBId) return;

    if (onUpdateIdeas) {
      const updated = ideas.map((i) => {
        if (i.id === nodeAId || i.id === nodeBId) {
          return {
            ...i,
            prerequisites: i.prerequisites.filter(
              (p) => p.targetId !== nodeAId && p.targetId !== nodeBId
            ),
          };
        }
        return i;
      });
      onUpdateIdeas(updated);
    }

    setSelectedEdgeId(null);
    setFeedbackToast('✓ Severed dependency connection wire.');
  }, [ideas, onUpdateIdeas]);

  // ========================================================
  // DELETE NODE FROM CANVAS
  // ========================================================
  const handleDeleteNode = (nodeId: string) => {
    const node = ideaMap.get(nodeId);
    const title = node?.title || 'Node';

    // Remove from positions meta
    const nextMeta = { ...nodesMetaRef.current };
    delete nextMeta[nodeId];
    saveNodesMeta(nextMeta);

    // Remove from ideas list and sever all incoming/outgoing wires
    if (onUpdateIdeas) {
      const updated = ideas
        .filter((i) => i.id !== nodeId)
        .map((i) => ({
          ...i,
          prerequisites: i.prerequisites.filter((p) => p.targetId !== nodeId),
        }));
      onUpdateIdeas(updated);
    }

    if (activeProblemId === nodeId) {
      const remaining = ideas.filter((i) => i.id !== nodeId);
      if (remaining.length > 0) {
        setActiveProblemId(remaining[0].id);
      }
    }

    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    setFeedbackToast(`Deleted "${title}"`);
  };

  // TOGGLE NODE TYPE (Real-World Problem ↔ Solvable Solution)
  const handleToggleNodeType = (nodeId: string) => {
    const node = ideaMap.get(nodeId);
    if (!node) return;
    const newType: IdeaType = node.type === 'problem' ? 'idea' : 'problem';

    if (onUpdateIdeas) {
      const updated = ideas.map((i) => (i.id === nodeId ? { ...i, type: newType } : i));
      onUpdateIdeas(updated);
    }
    setFeedbackToast(`Switched to ${newType === 'problem' ? 'Real-World Problem' : 'Solvable Solution'}`);
  };

  // ADD NEW PREREQUISITE TO A SPECIFIC NODE
  const handleOpenAddPrereqModal = (targetNodeId: string) => {
    setAddPrereqTargetNodeId(targetNodeId);
    setNewPrereqTitle('');
    setNewPrereqTagline('');
    setNewPrereqType('problem');
    setIsAddPrereqModalOpen(true);
  };

  const handleCreatePrereqNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrereqTitle.trim() || !addPrereqTargetNodeId) return;

    const target = ideaMap.get(addPrereqTargetNodeId);
    const targetMeta = nodesMeta[addPrereqTargetNodeId] || defaultTreeLayout[addPrereqTargetNodeId] || { x: 540, y: 240 };

    const newId = `prereq-${Date.now().toString(36)}`;
    const newIdea: Idea = {
      id: newId,
      title: newPrereqTitle.trim(),
      tagline: newPrereqTagline.trim() || `Required prerequisite to unlock ${target?.title || 'the target'}.`,
      type: newPrereqType,
      category: target?.category || 'Health & Public Safety',
      complexity: 'Weekend Prototype',
      author: {
        name: 'System Contributor',
        handle: '@contributor',
        role: 'Architect',
      },
      createdAt: new Date().toISOString().split('T')[0],
      motivation: {
        problemStatement: newPrereqTagline || 'Essential prerequisite constraint that must be resolved first.',
        theGap: `Identified gap blocking progress on ${target?.title || 'the target problem'}.`,
        whoItAffects: 'Operators, builders, and community.',
        impactIfSolved: `Directly unblocks ${target?.title || 'the downstream platform'}.`,
      },
      feasibility: {
        assessment: 'High feasibility modular component.',
        suggestedStack: ['TypeScript', 'Modular Protocol'],
        firstStep: 'Prototype minimal reproducible proof of concept.',
        pitfallsAndChallenges: 'Interface integration boundaries.',
      },
      existingSolutions: {
        alternatives: [],
        whyTheyFallShort: 'No open standard exists for this constraint.',
      },
      skillsNeeded: [
        {
          skill: 'Builder',
          roleDescription: 'Prototype and test component',
          filledCount: 0,
          targetCount: 1,
        },
      ],
      prerequisites: [],
      votes: { goodIdea: 1, feasible: 1, haveThisProblem: 1, wantToBuild: 0 },
      userVotes: { goodIdea: true },
      team: { status: 'open_for_builders', members: [] },
      discussions: [],
    };

    // Position new prerequisite to the left of target card
    const newMeta = {
      ...nodesMetaRef.current,
      [newId]: {
        x: targetMeta.x - 390,
        y: targetMeta.y + (Math.random() - 0.5) * 80,
        width: DEFAULT_CARD_WIDTH,
        height: DEFAULT_CARD_HEIGHT,
        color: newPrereqType === 'problem' ? ('rose' as const) : ('emerald' as const),
      },
    };
    saveNodesMeta(newMeta);

    // Wire new prerequisite into target
    if (onUpdateIdeas) {
      const updated = [
        ...ideas.map((i) => {
          if (i.id === addPrereqTargetNodeId) {
            return {
              ...i,
              prerequisites: [
                ...i.prerequisites,
                { targetId: newId, relationship: 'prerequisite_for' as const, note: 'Required prerequisite' },
              ],
            };
          }
          return i;
        }),
        newIdea,
      ];
      onUpdateIdeas(updated);
    }

    setIsAddPrereqModalOpen(false);
    setSelectedNodeId(newId);
    setFeedbackToast(`Added prerequisite "${newIdea.title}" and wired it into graph!`);
  };

  // ADD DOWNSTREAM NODE
  const handleAddDownstreamNode = (sourceNodeId: string) => {
    const source = ideaMap.get(sourceNodeId);
    const srcMeta = nodesMeta[sourceNodeId] || defaultTreeLayout[sourceNodeId] || { x: 540, y: 240 };

    const newId = `downstream-${Date.now().toString(36)}`;
    const newIdea: Idea = {
      id: newId,
      title: `Downstream System (${source?.title ? source.title.slice(0, 22) + '...' : 'Module'})`,
      tagline: 'Solvable application enabled once upstream prerequisites are resolved.',
      type: 'idea',
      category: source?.category || 'Health & Public Safety',
      complexity: '1-Month MVP',
      author: {
        name: 'Canvas Builder',
        handle: '@builder',
        role: 'Implementer',
      },
      createdAt: new Date().toISOString().split('T')[0],
      motivation: {
        problemStatement: 'Application that can now be built thanks to upstream unblocking.',
        theGap: 'Awaits foundational upstream components.',
        whoItAffects: 'End-users and community.',
        impactIfSolved: 'Delivers full end-to-end user value.',
      },
      feasibility: {
        assessment: 'Realistic prototype.',
        suggestedStack: ['React', 'TypeScript', 'Node.js'],
        firstStep: 'Wire API to upstream components.',
        pitfallsAndChallenges: 'Field adoption.',
      },
      existingSolutions: { alternatives: [], whyTheyFallShort: 'Pending foundational open hardware.' },
      skillsNeeded: [{ skill: 'Full-Stack Developer', roleDescription: 'Build UI and integration', filledCount: 0, targetCount: 1 }],
      prerequisites: [{ targetId: sourceNodeId, relationship: 'prerequisite_for', note: 'Built upon this foundation' }],
      votes: { goodIdea: 1, feasible: 1, haveThisProblem: 0, wantToBuild: 1 },
      userVotes: { goodIdea: true },
      team: { status: 'open_for_builders', members: [] },
      discussions: [],
    };

    // Position downstream card to the right of source card
    const newMeta = {
      ...nodesMetaRef.current,
      [newId]: {
        x: srcMeta.x + 390,
        y: srcMeta.y + (Math.random() - 0.5) * 80,
        width: DEFAULT_CARD_WIDTH,
        height: DEFAULT_CARD_HEIGHT,
        color: 'sky' as const,
      },
    };
    saveNodesMeta(newMeta);

    if (onUpdateIdeas) {
      onUpdateIdeas([...ideas, newIdea]);
    }

    setSelectedNodeId(newId);
    setFeedbackToast(`Added downstream card and wired it!`);
  };

  // SAVE QUICK EDIT FORM
  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdea) return;

    if (onUpdateIdeas) {
      const updated = ideas.map((i) => (i.id === editingIdea.id ? editingIdea : i));
      onUpdateIdeas(updated);
    }
    setIsQuickEditOpen(false);
    setFeedbackToast(`Saved changes to "${editingIdea.title}"`);
  };

  // KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          handleDeleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          e.preventDefault();
          const edge = visibleEdges.find((ed) => ed.id === selectedEdgeId);
          if (edge) handleDisconnect(edge.sourceId, edge.targetId);
        }
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setConnectingSourceNodeId(null);
        setIsConnectMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedEdgeId, visibleEdges, ideas, handleDisconnect]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative h-[calc(100vh-80px)] w-full overflow-hidden select-none bg-[#0c0c0e] font-sans"
      style={{
        backgroundImage: `radial-gradient(circle, #222228 1.5px, transparent 1.5px)`,
        backgroundSize: `${28 * transform.scale}px ${28 * transform.scale}px`,
        backgroundPosition: `${transform.x}px ${transform.y}px`,
        cursor: isPanning ? 'grabbing' : 'default',
      }}
    >
      {/* ======================================================== */}
      {/* TOP HEADER: SPECIFIC PROBLEM SELECTOR & SCOPE CONTROLS */}
      {/* ======================================================== */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Active Problem Selector & Info */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-[#141418]/95 border border-neutral-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
          {/* Target Problem Icon & Dropdown */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <Target className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider hidden sm:inline">
              Target Problem:
            </span>
            <select
              value={activeProblemId}
              onChange={(e) => handleSelectActiveProblem(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer max-w-[220px] sm:max-w-[320px] truncate"
            >
              {ideas.map((i) => (
                <option key={i.id} value={i.id} className="bg-neutral-900 text-white py-1">
                  {i.type === 'problem' ? '🚨 [Problem]' : '💡 [Solution]'} {i.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Problem Presets */}
          <div className="hidden xl:flex items-center gap-1 pl-1 border-l border-neutral-800">
            {FEATURED_PROBLEMS.map((preset) => {
              const isActive = activeProblemId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectActiveProblem(preset.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span>{preset.icon}</span>
                  <span className="truncate max-w-[120px]">{preset.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scope Toggle: Problem Tree (Focused) vs All Commons Cards */}
          <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 ml-1">
            <button
              type="button"
              onClick={() => setScopeMode('focused')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                scopeMode === 'focused'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Show only the active problem and its linked prerequisite tree"
            >
              <Target className="h-3 w-3" />
              <span>Tree ({activeProblemLineage.relatedNodeIds.size})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeMode('all')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                scopeMode === 'all'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Show all ideas in the Commons repository"
            >
              <Network className="h-3 w-3" />
              <span>All ({ideas.length})</span>
            </button>
          </div>
        </div>

        {/* Right: Specific Problem Actions Bar */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#141418]/95 border border-neutral-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
          {/* Add Prerequisite directly to this problem */}
          <button
            type="button"
            onClick={() => handleOpenAddPrereqModal(activeProblemId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold hover:bg-amber-300 shadow-md transition-all active:scale-95"
            title="Add a prerequisite constraint or component required to unlock this problem"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Add Prerequisite</span>
          </button>

          {/* Add Downstream Solution enabled by this problem */}
          <button
            type="button"
            onClick={() => handleAddDownstreamNode(activeProblemId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold hover:bg-sky-500/30 transition-all active:scale-95"
            title="Add a downstream solution that can be built once this problem is resolved"
          >
            <Lightbulb className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">+ Add Downstream</span>
          </button>

          {/* Reset Clean Tree Hierarchy */}
          <button
            type="button"
            onClick={handleResetToCleanTree}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Snap tree back to clean left-to-right DAG layout"
          >
            <Wand2 className="h-4 w-4" />
          </button>

          {/* Fit View */}
          <button
            type="button"
            onClick={handleFitView}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Fit graph to view"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CANVAS WORLD: SVG WIRES & DOM CARDS                      */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 pointer-events-none origin-top-left"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        {/* SVG LAYER: Directional Bezier Wires */}
        <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow-amber" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
              <polygon points="0 1, 8 4, 0 7" fill="#f59e0b" />
            </marker>
            <marker id="arrow-sky" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
              <polygon points="0 1, 8 4, 0 7" fill="#38bdf8" />
            </marker>
            <marker id="arrow-white" markerWidth="9" markerHeight="9" refX="8" refY="4" orient="auto">
              <polygon points="0 1, 8 4, 0 7" fill="#ffffff" />
            </marker>
          </defs>

          {/* Visual Column / Tier Labels */}
          <g opacity="0.4" className="select-none pointer-events-none font-mono text-[12px] uppercase tracking-wider">
            <text x="140" y="80" fill="#10b981" fontWeight="bold">
              ◄ Upstream Prerequisites (Unlocks)
            </text>
            <text x="540" y="80" fill="#f59e0b" fontWeight="bold">
              ★ Active Problem Under Exploration
            </text>
            <text x="930" y="80" fill="#38bdf8" fontWeight="bold">
              Downstream Solvable Platforms ►
            </text>
          </g>

          {/* Render All Visible Dependency Wires */}
          {visibleEdges.map((edge) => {
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
                  setSelectedNodeId(null);
                }}
              >
                {/* 100% Reliable Hit-Testing Path across all browsers */}
                <path
                  d={edge.pathData}
                  fill="none"
                  stroke="rgba(0,0,0,0.001)"
                  strokeWidth="24"
                  pointerEvents="stroke"
                />

                {/* Visible Bezier Curve */}
                <path
                  d={edge.pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 3 : edge.isDirectTreeEdge ? 2.5 : 1.8}
                  strokeDasharray={isSelected ? '6,4' : undefined}
                  opacity={isSelected ? 1 : isHovered ? 1 : 0.85}
                  markerEnd={`url(#${isSelected ? 'arrow-white' : edge.color === '#f59e0b' ? 'arrow-amber' : 'arrow-sky'})`}
                  className="transition-all duration-150"
                  pointerEvents="none"
                />

                {/* Animated Directional Flow Bead */}
                <circle r="2.8" fill={edge.color} pointerEvents="none">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path={edge.pathData} />
                </circle>
              </g>
            );
          })}

          {/* LIVE DRAGGING WIRE FROM HANDLE TO CURSOR */}
          {connectingSourceNodeId && (
            <path
              d={`M ${getNodePorts(connectingSourceNodeId)[connectingPort].x} ${
                getNodePorts(connectingSourceNodeId)[connectingPort].y
              } Q ${
                (getNodePorts(connectingSourceNodeId)[connectingPort].x + connectionCursor.x) / 2
              } ${
                (getNodePorts(connectingSourceNodeId)[connectingPort].y + connectionCursor.y) / 2 + 30
              }, ${connectionCursor.x} ${connectionCursor.y}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              markerEnd="url(#arrow-amber)"
            />
          )}
        </svg>

        {/* ======================================================== */}
        {/* INTERACTIVE MIDPOINT WIRE SEVER BUTTONS                  */}
        {/* Appears when hovering wire or when edge is selected      */}
        {/* ======================================================== */}
        {visibleEdges.map((edge) => {
          const isSelected = selectedEdgeId === edge.id;
          const isHovered = hoveredEdgeId === edge.id;

          if (!isSelected && !isHovered) return null;

          return (
            <div
              key={`pill-${edge.id}`}
              className="absolute z-40 pointer-events-auto -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900/95 px-2.5 py-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
              style={{ left: edge.midX, top: edge.midY }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                <Link2 className="h-3 w-3" />
                <span>Unlocks</span>
              </div>
              <div className="h-3 w-px bg-neutral-700" />
              <button
                type="button"
                onClick={() => handleDisconnect(edge.sourceId, edge.targetId)}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-white hover:bg-rose-600 px-1.5 py-0.5 rounded-full transition-colors cursor-pointer"
                title="Click to disconnect this wire"
              >
                <X className="h-3 w-3" />
                <span>Sever</span>
              </button>
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* DOM NODES (CARDS FOR THIS SPECIFIC PROBLEM GRAPH)        */}
        {/* ======================================================== */}
        {canvasNodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isTarget = node.isTargetProblem;
          const isHovered = hoveredNodeId === node.id;
          const isWireSource = connectingSourceNodeId === node.id;

          // Color & Border Styling
          let borderClass = 'border-neutral-800 bg-[#141418] hover:border-neutral-600';
          let glowStyle: React.CSSProperties = {};

          if (isTarget) {
            borderClass = 'border-amber-400/90 bg-[#181611] ring-2 ring-amber-400/80 shadow-2xl';
            glowStyle = { boxShadow: '0 0 35px rgba(245, 158, 11, 0.3)' };
          } else if (node.isUpstream) {
            borderClass = 'border-emerald-500/50 bg-[#121614] hover:border-emerald-400';
          } else if (node.isDownstream) {
            borderClass = 'border-sky-500/50 bg-[#12151a] hover:border-sky-400';
          } else if (node.idea.type === 'problem') {
            borderClass = 'border-rose-500/40 bg-[#161214] hover:border-rose-400';
          }

          if (isWireSource) {
            borderClass = 'border-amber-400 ring-2 ring-amber-400 animate-pulse bg-amber-950/30';
          } else if (isSelected) {
            borderClass += ' ring-2 ring-white shadow-2xl';
          }

          return (
            <div
              key={node.id}
              className={`canvas-node absolute pointer-events-auto rounded-2xl border transition-all duration-150 select-none flex flex-col justify-between cursor-grab active:cursor-grabbing ${borderClass}`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
                ...glowStyle,
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              // WHOLE-CARD DRAGGING: Dragging begins anywhere on the card!
              onMouseDown={(e) => {
                // Ignore clicks on buttons, links, inputs, or ports
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.connection-port')) {
                  return;
                }
                e.stopPropagation();
                hasMovedDuringDragRef.current = false;
                setDraggingNodeId(node.id);
                dragStartPosRef.current = {
                  clientX: e.clientX,
                  clientY: e.clientY,
                  initialNodeX: node.x,
                  initialNodeY: node.y,
                };
              }}
              // Complete wire connection when releasing mouse over this card
              onMouseUp={(e) => {
                if (connectingSourceNodeId && connectingSourceNodeId !== node.id) {
                  e.stopPropagation();
                  handleConnect(connectingSourceNodeId, node.id);
                  setConnectingSourceNodeId(null);
                  setIsConnectMode(false);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (hasMovedDuringDragRef.current) return;

                // Handle click-to-connect tool
                if (isConnectMode || connectingSourceNodeId) {
                  if (!connectingSourceNodeId) {
                    setConnectingSourceNodeId(node.id);
                    setFeedbackToast(`Selected "${node.idea.title}". Click the card it unlocks.`);
                  } else if (connectingSourceNodeId !== node.id) {
                    handleConnect(connectingSourceNodeId, node.id);
                    setConnectingSourceNodeId(null);
                    setIsConnectMode(false);
                  }
                  return;
                }

                setSelectedNodeId(node.id);
                setSelectedEdgeId(null);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingIdea(node.idea);
                setIsQuickEditOpen(true);
              }}
            >
              {/* ======================================================== */}
              {/* FLOATING ACTION TOOLBAR (Appears on Hover or Selection) */}
              {/* ======================================================== */}
              {(isHovered || isSelected) && (
                <div
                  className="absolute -top-10 left-2 z-50 flex items-center gap-1 rounded-xl border border-neutral-700 bg-neutral-900/95 px-2 py-1 shadow-2xl backdrop-blur-md pointer-events-auto animate-in fade-in duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* + Prereq to this node */}
                  <button
                    type="button"
                    onClick={() => handleOpenAddPrereqModal(node.id)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 hover:bg-neutral-800 hover:text-amber-300 transition-colors"
                    title="Add a prerequisite constraint required before this node can be built"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Prereq</span>
                  </button>

                  <div className="h-3.5 w-px bg-neutral-800" />

                  {/* ✏️ Edit Card Title & Friction */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIdea(node.idea);
                      setIsQuickEditOpen(true);
                    }}
                    className="p-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Edit card details"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>

                  {/* 🔄 Switch Type (Problem ↔ Solution) */}
                  <button
                    type="button"
                    onClick={() => handleToggleNodeType(node.id)}
                    className="p-1 rounded text-neutral-300 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
                    title={node.idea.type === 'problem' ? 'Switch to Solution Card' : 'Switch to Problem Card'}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>

                  {/* 🔗 Wire From This Node */}
                  <button
                    type="button"
                    onClick={() => {
                      setConnectingSourceNodeId(node.id);
                      setConnectingPort('right');
                      setIsConnectMode(true);
                      setFeedbackToast(`🔗 Wiring: Click the target card that "${node.idea.title}" unlocks.`);
                    }}
                    className="p-1 rounded text-sky-400 hover:text-sky-300 hover:bg-neutral-800 transition-colors"
                    title="Draw wire from this node onto another card"
                  >
                    <Link2 className="h-3 w-3" />
                  </button>

                  {/* 🎯 Focus Dependency Graph on This Problem */}
                  {!isTarget && (
                    <button
                      type="button"
                      onClick={() => handleSelectActiveProblem(node.id)}
                      className="p-1 rounded text-amber-400 hover:text-amber-300 hover:bg-neutral-800 transition-colors"
                      title="Make this the Active Target Problem to explore its dependencies"
                    >
                      <Target className="h-3 w-3" />
                    </button>
                  )}

                  <div className="h-3.5 w-px bg-neutral-800" />

                  {/* 🗑️ Delete Node */}
                  <button
                    type="button"
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950 transition-colors"
                    title="Delete this card from canvas"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* ======================================================== */}
              {/* CARD HEADER                                              */}
              {/* ======================================================== */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-800/80 bg-neutral-900/60 rounded-t-2xl">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isTarget ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-amber-400 text-neutral-950">
                      <Crown className="h-3 w-3" />
                      <span>Target Problem</span>
                    </span>
                  ) : node.isUpstream ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span>Prerequisite</span>
                    </span>
                  ) : node.isDownstream ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      <span>Downstream</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300">
                      {node.idea.type === 'problem' ? 'Problem' : 'Solution'}
                    </span>
                  )}

                  <span className="text-[10px] text-neutral-400 truncate max-w-[110px]">
                    · {node.idea.category.split('&')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-neutral-500">
                  <GripHorizontal className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* ======================================================== */}
              {/* CARD BODY                                                */}
              {/* ======================================================== */}
              <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors">
                    {node.idea.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {node.idea.tagline}
                  </p>
                </div>

                {/* Footer Badges & Direct Wire Disconnect Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {node.idea.prerequisites.length > 0 ? (
                      node.idea.prerequisites.map((p) => {
                        const prereqIdea = ideaMap.get(p.targetId);
                        return (
                          <div
                            key={p.targetId}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-[9.5px]"
                          >
                            <span className="truncate max-w-[90px]">{prereqIdea?.title || 'Prereq'}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDisconnect(p.targetId, node.id);
                              }}
                              className="text-neutral-500 hover:text-rose-400 p-0.5"
                              title={`Sever connection from ${prereqIdea?.title || 'Prereq'}`}
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-neutral-500 font-mono text-[9.5px]">Root Foundation</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectIdea(node.idea);
                    }}
                    className="text-neutral-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors shrink-0 ml-1"
                  >
                    <span>Spec</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* INTERACTIVE CONNECTION PORTS                             */}
              {/* ======================================================== */}
              {/* Left Port (Input: Prerequisite into this) */}
              <div
                className="connection-port absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-neutral-900 border-2 border-emerald-400 hover:scale-125 cursor-crosshair z-30 transition-transform shadow-md flex items-center justify-center"
                title="Input: Connect prerequisite into this card"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setConnectingSourceNodeId(node.id);
                  setConnectingPort('left');
                }}
                onMouseUp={(e) => {
                  if (connectingSourceNodeId && connectingSourceNodeId !== node.id) {
                    e.stopPropagation();
                    handleConnect(connectingSourceNodeId, node.id);
                    setConnectingSourceNodeId(null);
                    setIsConnectMode(false);
                  }
                }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>

              {/* Right Port (Output: Unlocks downstream) */}
              <div
                className="connection-port absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-neutral-900 border-2 border-amber-400 hover:scale-125 cursor-crosshair z-30 transition-transform shadow-md flex items-center justify-center"
                title="Output: Drag wire onto downstream card that this unlocks"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setConnectingSourceNodeId(node.id);
                  setConnectingPort('right');
                }}
                onMouseUp={(e) => {
                  if (connectingSourceNodeId && connectingSourceNodeId !== node.id) {
                    e.stopPropagation();
                    handleConnect(connectingSourceNodeId, node.id);
                    setConnectingSourceNodeId(null);
                    setIsConnectMode(false);
                  }
                }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>

              {/* Bottom Right Resize Handle */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize opacity-40 hover:opacity-100 z-30"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setResizingNodeId(node.id);
                  resizeStartRef.current = {
                    clientX: e.clientX,
                    clientY: e.clientY,
                    width: node.width,
                    height: node.height,
                  };
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* OBSIDIAN CANVAS BOTTOM DOCK TOOLBAR                     */}
      {/* ======================================================== */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-2xl border border-neutral-800 bg-[#141418]/95 px-3 py-2 shadow-2xl backdrop-blur-xl pointer-events-auto">
        {/* Add Prerequisite Card */}
        <button
          type="button"
          onClick={() => handleOpenAddPrereqModal(activeProblemId)}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all shadow-sm"
          title="Add a new prerequisite required before this problem can be solved"
        >
          <FileText className="h-4 w-4 text-emerald-400" />
          <span>+ Prereq Card</span>
        </button>

        {/* Add Solution Card */}
        <button
          type="button"
          onClick={() => handleAddDownstreamNode(activeProblemId)}
          className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-500/20 active:scale-95 transition-all shadow-sm"
          title="Add a downstream solution that builds on this problem"
        >
          <Lightbulb className="h-4 w-4 text-sky-400" />
          <span>+ Solution Card</span>
        </button>

        <div className="h-5 w-px bg-neutral-800 mx-0.5" />

        {/* Connect Tool Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !isConnectMode;
            setIsConnectMode(next);
            if (!next) {
              setConnectingSourceNodeId(null);
            } else {
              setFeedbackToast('🔗 Connect Tool active: Click 1st card, then click the card it unlocks.');
            }
          }}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
            isConnectMode
              ? 'border-amber-400 bg-amber-500/25 text-amber-200 ring-2 ring-amber-400/40 animate-pulse'
              : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white'
          }`}
          title="Click 1st card then 2nd card to wire them"
        >
          <Link2 className="h-4 w-4 text-amber-400" />
          <span>{isConnectMode ? 'Click 2 Cards...' : 'Connect Wires'}</span>
        </button>

        {/* Auto-Align Tree */}
        <button
          type="button"
          onClick={handleResetToCleanTree}
          className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-amber-300 hover:border-amber-400/60 transition-colors"
          title="Align cards into clean left-to-right DAG dependency hierarchy"
        >
          <Wand2 className="h-4 w-4 text-amber-400" />
          <span className="hidden sm:inline">Auto-Tree</span>
        </button>

        {/* Delete Selected Node */}
        {selectedNodeId && (
          <>
            <div className="h-5 w-px bg-neutral-800 mx-0.5" />
            <button
              type="button"
              onClick={() => handleDeleteNode(selectedNodeId)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/50 bg-rose-950/70 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-900 active:scale-95 transition-all shadow-md animate-in fade-in"
              title="Delete the currently selected card (or press Delete key)"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Delete Card</span>
            </button>
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* FLOATING ZOOM CONTROLS (Right Side Dock)                 */}
      {/* ======================================================== */}
      <div className="absolute right-4 bottom-5 z-20 flex flex-col items-center gap-1 rounded-2xl border border-neutral-800 bg-[#141418]/95 p-1.5 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => {
            const nextScale = Math.min(transform.scale * 1.25, 2.2);
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
          onClick={handleFitView}
          className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Fit Graph to View"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* TOAST FEEDBACK ALERT                                     */}
      {/* ======================================================== */}
      {feedbackToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-neutral-700 bg-neutral-900/95 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD PREREQUISITE TO SPECIFIC PROBLEM              */}
      {/* ======================================================== */}
      {isAddPrereqModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsAddPrereqModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-neutral-800 bg-[#16161a] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                  <Plus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Add Prerequisite to Dependency Graph</h3>
                  <p className="text-[11px] text-neutral-400">
                    What constraint must be resolved before this problem can be tackled?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPrereqModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePrereqNode} className="mt-4 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="text-xs font-semibold text-neutral-300">Prerequisite Classification</label>
                <div className="mt-1.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPrereqType('problem')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      newPrereqType === 'problem'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>Real-World Friction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPrereqType('idea')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      newPrereqType === 'idea'
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Technical Component</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Prerequisite Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Standardized 480-Byte Offline NFC Protocol Schema"
                  value={newPrereqTitle}
                  onChange={(e) => setNewPrereqTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Why It's Needed (Friction / Gap)</label>
                <textarea
                  rows={3}
                  placeholder="Explains what this component provides and why downstream systems cannot function without it..."
                  value={newPrereqTagline}
                  onChange={(e) => setNewPrereqTagline(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddPrereqModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 shadow-md cursor-pointer"
                >
                  Wire Into Graph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT CARD DETAILS                                 */}
      {/* ======================================================== */}
      {isQuickEditOpen && editingIdea && (
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
                <h3 className="text-sm font-bold text-white">Edit Problem / Solution Card</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickEditOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="mt-4 space-y-4">
              {/* Type Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-300">Classification</label>
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingIdea({ ...editingIdea, type: 'problem' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      editingIdea.type === 'problem'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    🚨 Real-World Problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIdea({ ...editingIdea, type: 'idea' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      editingIdea.type === 'idea'
                        ? 'border-sky-400 bg-sky-500/20 text-sky-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    💡 Solvable Solution
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Card Title</label>
                <input
                  type="text"
                  required
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Tagline / Summary</label>
                <textarea
                  rows={3}
                  value={editingIdea.tagline}
                  onChange={(e) => setEditingIdea({ ...editingIdea, tagline: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300">Domain Category</label>
                <select
                  value={editingIdea.category}
                  onChange={(e) => setEditingIdea({ ...editingIdea, category: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Health & Public Safety">Health & Public Safety</option>
                  <option value="Food Systems & Agriculture">Food Systems & Agriculture</option>
                  <option value="Hardware & Right-to-Repair">Hardware & Right-to-Repair</option>
                  <option value="Civic Tech & Environment">Civic Tech & Environment</option>
                  <option value="Productivity & Public Tech">Productivity & Public Tech</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteNode(editingIdea.id);
                    setIsQuickEditOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950 flex items-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Node</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickEditOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
