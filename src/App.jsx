import { RoyalRequirements } from './components/RoyalRequirements';
import { WelcomeNotice } from './components/WelcomeNotice';
import { isVersionNewer, readPreference, writePreference } from './lib/releaseNotices';
import { useSupportImpression } from './hooks/useSupportImpression';
import { trackEvent } from './lib/analytics';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GuideLinks } from './components/GuideLinks';
import { NextGameVote } from './components/NextGameVote';
import { ShareTracker } from './components/ShareTracker';
import { CONFIDANT_INTERACTIONS } from './data/confidantData';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Users, 
  Sword, 
  Info, 
  Save, 
  AlertTriangle, 
  Trophy,
  ChevronRight,
  BookOpen,
  Coffee,
  Star,
  Search,
  Target,
  MapPin,
  Clock,
  Zap,
  Download,
  Copy,
  ClipboardCheck,
  CheckSquare,
  Square,
  Gift,
  MessageCircle,
  ChevronDown,
  Wrench,
  Heart,
  Book,
  Sparkles,
  Lightbulb,
  Library,
  ExternalLink,
  Cpu,
  PlayCircle,
  FileText,
  MessageSquare,
  Ghost,
  Menu
} from 'lucide-react';

import { APP_DATA } from './data/gameData';
import { PERSONA_DATA } from './data/personaData';
import { APP_VERSION } from './data/version';
import { RESOURCE_DATA } from './data/resourceData';
import { CROSSWORD_DATA } from './data/crosswordData';
import { CONFIDANT_STAT_GATES, SOCIAL_STATS } from './data/socialStats';
import { RELEASE_NOTES } from './data/releaseNotes';
import { ROADMAP } from './data/roadmap';
import { MAX_SAVE_BYTES, PREVIOUS_SAVE_KEY, parseSave, persistImportedSave, loadStoredSave, persistProgress } from './lib/saveData';

const STAT_ICONS = {
  Knowledge: Book,
  Guts: Sword,
  Proficiency: Wrench,
  Kindness: Heart,
  Charm: Sparkles
};

const RESOURCE_ICONS = {
  Cpu,
  BookOpen,
  Sword,
  Trophy,
  Sparkles,
  Users,
  Zap
};

const FORMAT_ICONS = {
  video: PlayCircle,
  tool: Wrench,
  guide: FileText,
  community: MessageSquare
};


function SupportCard({ location }) {
  const impressionRef = useSupportImpression(location);
  return (
    <div ref={impressionRef} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 md:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-900/30">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h4 className="text-sm md:text-base font-black uppercase tracking-wider text-white">
              Support This Project
            </h4>
            <p className="text-[11px] md:text-xs text-neutral-400 leading-relaxed max-w-xl">
              P5 Tracker is free and ad-free. If it helped your playthrough, an optional tip supports fixes and updates.
            </p>
          </div>
        </div>
        <a
          href="https://ko-fi.com/K3K11RWTSL"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('support-card-click', { location })}
          className="inline-flex items-center gap-2 bg-[#FF5E5B] hover:bg-white text-white hover:text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-b-2 border-[#c44040] hover:border-neutral-300"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          Support on Ko-fi
        </a>
      </div>
    </div>
  );
}

export default function App() {
    const [loadedSave] = useState(() => {
      try { return loadStoredSave(window.localStorage); } catch { return loadStoredSave(undefined); }
    });
    const [savingEnabled, setSavingEnabled] = useState(loadedSave.canSave);
    const [saveWarning, setSaveWarning] = useState(loadedSave.warning);
    const saveFailureTracked = useRef(false);
    useEffect(() => {
      if (saveWarning && !saveFailureTracked.current) {
        saveFailureTracked.current = true;
        trackEvent('save_persistence_failed', { kind: loadedSave.failure || 'write_failed' });
      }
    }, [saveWarning, loadedSave]);
    const [activeTab, setActiveTab] = useState(() => {
      // 1. Try URL Hash first
      const hash = window.location.hash.replace('#', '');
      const hashMap = {
        'briefing': 'cheatsheet',
        'calendar': 'months',
        'confidants': 'confidants',
        'metaverse': 'metaverse',
        'more': 'more',
        'registry': 'registry_view',
        'reference': 'library_view'
      };
      if (hash && hashMap[hash]) return hashMap[hash];
  
      // 2. Fallback to Local Storage
      const saved = readPreference('p5r_activeTab') || 'cheatsheet';
      if (saved === 'library') return 'library_view';
      if (saved === 'registry') return 'registry_view';
      if (saved === 'palaces' || saved === 'mementos') return 'metaverse';
      return ['cheatsheet', 'months', 'confidants', 'metaverse', 'more', 'library_view', 'registry_view'].includes(saved) ? saved : 'cheatsheet';
    });
  
    // Sync state to URL hash
    useEffect(() => {
      const stateToHash = {
        'cheatsheet': 'briefing',
        'months': 'calendar',
        'confidants': 'confidants',
        'metaverse': 'metaverse',
        'more': 'more',
        'registry_view': 'registry',
        'library_view': 'reference'
      };
      if (stateToHash[activeTab]) {
        window.location.hash = stateToHash[activeTab];
      }
      writePreference('p5r_activeTab', activeTab);
    }, [activeTab]);
  
    // Sync URL hash to state (Back/Forward support)
    useEffect(() => {
      const handleHashChange = () => {
        const hash = window.location.hash.replace('#', '');
        const hashMap = {
          'briefing': 'cheatsheet',
          'calendar': 'months',
          'confidants': 'confidants',
          'metaverse': 'metaverse',
          'more': 'more',
          'registry': 'registry_view',
          'reference': 'library_view'
        };
        if (hash && hashMap[hash]) {
          setActiveTab(hashMap[hash]);
        }
      };
  
          window.addEventListener('hashchange', handleHashChange);
          return () => window.removeEventListener('hashchange', handleHashChange);
        }, []);
      
        const [metaverseView, setMetaverseView] = useState('palaces');
        const [anchoredMonth, setAnchoredMonth] = useState(loadedSave.save.anchoredMonth);
        const [currentMonth, setCurrentMonth] = useState(loadedSave.save.anchoredMonth);
        const [searchTerm, setSearchTerm] = useState('');
        const [registrySearch, setRegistrySearch] = useState('');
        const [registryFilter, setRegistryFilter] = useState('All');
        
        // Data State
        const [checkedItems, setCheckedItems] = useState(loadedSave.save.checkedItems);
        const [socialStats, setSocialStats] = useState(loadedSave.save.socialStats);
        const [confidantRanks, setConfidantRanks] = useState(loadedSave.save.confidantRanks);

        const [expandedGuides, setExpandedGuides] = useState({});
        const [expandedPalace, setExpandedPalace] = useState(null);
        const [expandedMementos, setExpandedMementos] = useState(null);
        const [showArchived, setShowArchived] = useState(false);
        const [saveModal, setSaveModal] = useState(false);
        const [importText, setImportText] = useState('');
        const [copied, setCopied] = useState(false);
        const hiddenInputRef = useRef(null);
        const [saveStatus, setSaveStatus] = useState('');
        const [hasPreviousSave, setHasPreviousSave] = useState(() => {
          try { return Boolean(localStorage.getItem(PREVIOUS_SAVE_KEY)); } catch { return false; }
        });
      
        useEffect(() => {
          if (import.meta.env.DEV) {
            document.title = 'P5Tracker - DEV';
          } else {
            document.title = 'Persona 5 Royal tracker | Monthly goals and confidants';
          }
        }, []);
      
        const toggleGuide = (arcana) => {
          setExpandedGuides(prev => ({ ...prev, [arcana]: !prev[arcana] }));
        };
  useEffect(() => {
    if (!savingEnabled) return;
    try {
      persistProgress(window.localStorage, { checkedItems, socialStats, confidantRanks, anchoredMonth });
      setSaveWarning('');
    } catch {
      setSaveWarning('This browser could not save your latest changes. Keep this tab open and download a backup before leaving.');
    }
  }, [checkedItems, socialStats, confidantRanks, anchoredMonth, savingEnabled]);

  const migrateCrosswords = (items) => {
    const allKeys = Object.keys(items);
    
    // Count different types of legacy indicators
    const legacyDateCount = allKeys.filter(k => k.includes('_cw') && !k.startsWith('cw_')).length;
    const failedMigrationCount = allKeys.filter(k => k.match(/^cw\d+$/)).length;
    const oldAttemptCount = allKeys.filter(k => k.startsWith('cw_') && !k.startsWith('cw_ans_') && !k.startsWith('cw_slot_')).length;
    const oldAugCount = allKeys.filter(k => k.startsWith('aug_q')).length;

    // We take the HIGHEST count found to determine progress
    const maxProgress = Math.max(legacyDateCount + oldAugCount, failedMigrationCount, oldAttemptCount);

    // Check if we already have the new format
    const hasNewFormat = allKeys.some(k => k.startsWith('cw_slot_') || k.startsWith('cw_ans_'));

    if (maxProgress > 0 && !hasNewFormat) {
      const next = { ...items };
      
      // 1. Enforce the correct sequence for BOTH slots and answers
      for (let i = 1; i <= maxProgress; i++) {
        next[`cw_slot_${i}`] = true; // Calendar checkboxes
        next[`cw_ans_${i}`] = true;  // Briefing checkboxes
      }

      // 2. Nuke all non-standard keys
      allKeys.forEach(k => {
        if (
          (k.includes('_cw') && !k.startsWith('cw_slot_') && !k.startsWith('cw_ans_')) || 
          k.startsWith('aug_q') || 
          k.match(/^cw\d+$/) ||
          (k.startsWith('cw_') && !k.startsWith('cw_slot_') && !k.startsWith('cw_ans_'))
        ) {
          delete next[k];
        }
      });
      
      return next;
    }
    return items;
  };

  // --- Legacy Crossword Migration (On Mount) ---
  useEffect(() => {
    setCheckedItems(prev => migrateCrosswords(prev));
  }, []);

  const [showChangelog, setShowChangelog] = useState(false);
  const [changelogFullHistory, setChangelogFullHistory] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const lastSeenVersion = useRef(readPreference('p5r_lastSeenVersion'));
  const [showWelcome, setShowWelcome] = useState(() => !readPreference('p5r_onboardingComplete'));
  const [hasNewRelease, setHasNewRelease] = useState(() => Boolean(lastSeenVersion.current) && isVersionNewer(RELEASE_NOTES[0]?.version, lastSeenVersion.current));

  useEffect(() => {
    writePreference('p5r_lastSeenVersion', RELEASE_NOTES[0]?.version || APP_VERSION);
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    writePreference('p5r_onboardingComplete', 'true');
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setShowWelcome(false);
    writePreference('p5r_onboardingComplete', 'true');
    trackEvent('onboarding-complete');
  };


  const usedTracker = useRef(false);
  const recordProgress = (kind) => {
    trackEvent('tracker_progress_changed', { kind });
    if (!usedTracker.current) {
      usedTracker.current = true;
      trackEvent('tracker_used');
    }
  };

  const updateRank = (arcana, val) => {
    const next = Math.min(10, Math.max(0, parseInt(val) || 0));
    if (next === (confidantRanks[arcana] || 0)) return;
    setConfidantRanks(prev => ({ ...prev, [arcana]: next }));
    recordProgress('confidant');
  };

  const updateStat = (stat, val) => {
    const next = Math.min(5, Math.max(1, parseInt(val) || 1));
    if (next === (socialStats[stat] || 1)) return;
    setSocialStats(prev => ({ ...prev, [stat]: next }));
    recordProgress('social-stat');
  };

  const isGateBlocked = (arcana, currentRank) => {
    const nextRank = currentRank + 1;
    const gate = CONFIDANT_STAT_GATES[arcana]?.[nextRank];
    if (!gate) return false;
    return socialStats[gate.stat] < gate.lvl ? gate : false;
  };

  const isTaskChecked = (task) => {
    return checkedItems[task.id];
  };

  const toggleItem = (id) => {
    recordProgress('checklist');
    if (!checkedItems[id]) trackEvent('task_checked');
    // Crossword Opportunity Logic (Calendar)
    if (id.startsWith('cw_opp_')) {
      const isChecking = !checkedItems[id];
      
      setCheckedItems(prev => {
        const next = { ...prev };
        if (isChecking) {
          next[id] = true;
          // Find next unchecked answer and check it
          const nextAns = CROSSWORD_DATA.find(cw => !prev[cw.id] && !next[cw.id]);
          if (nextAns) next[nextAns.id] = true;
        } else {
          delete next[id];
          // Find latest checked answer and uncheck it
          const lastAns = [...CROSSWORD_DATA].reverse().find(cw => prev[cw.id] && next[cw.id]);
          if (lastAns) delete next[lastAns.id];
        }
        return next;
      });
      return;
    }

    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentSave = () => ({ checkedItems, confidantRanks, anchoredMonth, socialStats });

  const handleCopy = async () => {
    const data = JSON.stringify(currentSave());
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data);
      } else if (hiddenInputRef.current) {
        hiddenInputRef.current.value = data;
        hiddenInputRef.current.select();
        if (!document.execCommand('copy')) throw new Error('Copy failed');
      } else throw new Error('Copy unavailable');
      trackEvent('save_copied');
      setCopied(true);
      setSaveStatus('Save copied. Paste it into the Sync Terminal on your other device.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setSaveStatus('Clipboard access is unavailable. Use Download Save instead.');
    }
  };

  const exportFile = () => {
    const blob = new Blob([JSON.stringify(currentSave())], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p5r_tactician_save.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    trackEvent('save_download_started');
    setSaveStatus('Save download started. Keep this file to transfer or recover your progress.');
  };

  const exportOriginal = () => {
    if (!loadedSave.original) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: 'p5tracker-original-storage', version: 1, values: loadedSave.original }, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'p5tracker-original-storage.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaveStatus('Original data download started. Keep this recovery document; it is not a normal import file.');
  };

  const applySave = (text, restoring = false, method = 'paste') => {
    try {
      const parsed = parseSave(text);
      const next = { ...currentSave(), ...parsed, checkedItems: migrateCrosswords(parsed.checkedItems) };
      persistImportedSave(localStorage, currentSave(), next, !savingEnabled ? loadedSave.original : null);
      setSavingEnabled(true);
      setSaveWarning('');
      setCheckedItems(next.checkedItems);
      setConfidantRanks(next.confidantRanks);
      setSocialStats(next.socialStats);
      setAnchoredMonth(next.anchoredMonth);
      setCurrentMonth(next.anchoredMonth);
      setHasPreviousSave(true);
      setImportText('');
      trackEvent(restoring ? 'save_restored' : 'save_imported', { method: restoring ? 'backup' : method });
      setSaveStatus(restoring ? 'Previous save restored. You can restore again to undo this change.' : 'Save imported. Your previous progress is backed up on this device.');
    } catch (error) {
      trackEvent('save_import_failed', { method: restoring ? 'backup' : method });
      setSaveStatus(error.message);
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!/\.(txt|json)$/i.test(file.name) || file.size > MAX_SAVE_BYTES) {
      trackEvent('save_import_failed', { method: 'file' });
      setSaveStatus('Choose a .txt or .json save file smaller than 1 MB.');
      return;
    }
    try { applySave(await file.text(), false, 'file'); }
    catch { trackEvent('save_import_failed', { method: 'file' }); setSaveStatus('The file could not be read. Your progress has not changed.'); }
  };

  const restorePreviousSave = () => {
    try {
      const backup = localStorage.getItem(PREVIOUS_SAVE_KEY);
      if (!backup) { setSaveStatus('No previous save is available on this device.'); return; }
      applySave(backup, true);
    } catch { setSaveStatus('The previous save could not be read. Your progress has not changed.'); }
  };

  // --- Smart Backlog Logic ---
  const getSmartMonthData = (monthId) => {
    const viewingMonthIndex = APP_DATA.months.findIndex(m => m.id === monthId);
    const anchoredMonthIndex = APP_DATA.months.findIndex(m => m.id === anchoredMonth);
    
    if (viewingMonthIndex === -1) return null;

    const viewingMonthData = APP_DATA.months[viewingMonthIndex];
    
    // 1. Aggregate Backlog
    const backlogTasks = [];
    
    if (viewingMonthIndex === anchoredMonthIndex) {
      for (let i = 0; i < viewingMonthIndex; i++) {
        APP_DATA.months[i].tasks.forEach(task => {
          if (!checkedItems[task.id] && !task.isMissable) {
            backlogTasks.push({ ...task, sourceMonth: APP_DATA.months[i].name, isOverdue: true });
          }
        });
      }
    }

    // 2. Calculate Effective Targets
    const effectiveTargets = {};
    
    APP_DATA.confidants.forEach(confidant => {
      if (!confidant.monthlyTargets) return;

      for (let i = 0; i <= viewingMonthIndex; i++) {
        const m = APP_DATA.months[i];
        const targetForMonth = confidant.monthlyTargets[m.id];
        
        if (targetForMonth !== undefined) {
          if (!effectiveTargets[confidant.arcana] || targetForMonth > effectiveTargets[confidant.arcana].r) {
            effectiveTargets[confidant.arcana] = { 
              arc: `${confidant.arcana} (${confidant.name})`, 
              r: targetForMonth,
              sourceMonth: m.name,
              isCurrent: i === viewingMonthIndex 
            };
          }
        }
      }
    });

    const activeTargets = Object.values(effectiveTargets).filter(t => {
      const arcanaKey = t.arc.split(' (')[0]; 
      const currentRank = confidantRanks[arcanaKey] || 0;
      if (t.isCurrent) return true;
      if (currentRank < t.r) return true;
      return false;
    }).sort((a, b) => {
      const aDeficit = (confidantRanks[a.arc.split(' (')[0]] || 0) < a.r;
      const bDeficit = (confidantRanks[b.arc.split(' (')[0]] || 0) < b.r;
      if (aDeficit && !bDeficit) return -1;
      if (!aDeficit && bDeficit) return 1;
      return b.r - a.r;
    });

    return {
      ...viewingMonthData,
      tasks: [...backlogTasks, ...viewingMonthData.tasks],
      smartTargets: activeTargets,
      status: viewingMonthIndex < anchoredMonthIndex ? 'HISTORY' : viewingMonthIndex === anchoredMonthIndex ? 'ACTIVE' : 'PREVIEW'
    };
  };

  const activeMonthData = getSmartMonthData(currentMonth);

  // --- Bottleneck detection ---
  const bottleneckStats = useMemo(() => {
    const stats = new Set();
    APP_DATA.confidants.forEach(c => {
      const gate = isGateBlocked(c.arcana, confidantRanks[c.arcana]);
      if (gate) stats.add(gate.stat);
    });
    return stats;
  }, [socialStats, confidantRanks]);

  const isTaskStatBuilding = (taskText) => {
    const text = taskText.toLowerCase();
    for (const stat of SOCIAL_STATS) {
      if (text.includes(stat.id.toLowerCase()) && bottleneckStats.has(stat.id)) {
        return stat.id;
      }
    }
    return null;
  };

  // Get all classroom answers for Reference tab
  const classroomAnswers = useMemo(() => {
    return APP_DATA.months.flatMap(m => 
      m.tasks
        .filter(t => t.text.includes('Answer:') || t.text.includes('Exam:') || t.text.includes('Crossword:'))
        .map(t => ({ ...t, month: m.name }))
    );
  }, []);

  const filteredPersonas = useMemo(() => {
    return PERSONA_DATA.registry.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(registrySearch.toLowerCase()) || 
                            p.arcana.toLowerCase().includes(registrySearch.toLowerCase());
      const matchesFilter = registryFilter === 'All' || p.arcana === registryFilter;
      return matchesSearch && matchesFilter;
    });
  }, [registrySearch, registryFilter]);

  const personasByArcana = useMemo(() => {
    const groups = {};
    const sortedArcanas = [...new Set(PERSONA_DATA.registry.map(p => p.arcana))].sort();
    
    sortedArcanas.forEach(arc => {
      const items = filteredPersonas.filter(p => p.arcana === arc);
      if (items.length > 0) groups[arc] = items;
    });
    return groups;
  }, [filteredPersonas]);

  const registryStats = useMemo(() => {
    const total = PERSONA_DATA.registry.length;
    const completed = PERSONA_DATA.registry.filter(p => checkedItems[`p_${p.name}`]).length;
    return { 
      total, 
      completed, 
      percent: total > 0 ? Math.round((completed / total) * 100) : 0 
    };
  }, [checkedItems]);

  // Auto-expand relevant palace
  useEffect(() => {
    const anchoredMonthIdx = APP_DATA.months.findIndex(m => m.id === anchoredMonth);
    const palaceIdx = APP_DATA.palaces.findIndex(p => {
      const startIdx = APP_DATA.months.findIndex(m => m.id === p.monthId);
      const endIdx = p.deadlineMonth ? APP_DATA.months.findIndex(m => m.id === p.deadlineMonth) : startIdx;
      return anchoredMonthIdx >= startIdx && anchoredMonthIdx <= endIdx;
    });
    if (palaceIdx !== -1) setExpandedPalace(palaceIdx);
  }, [anchoredMonth]);

  // Auto-expand relevant mementos
  useEffect(() => {
    const anchoredMonthIdx = APP_DATA.months.findIndex(m => m.id === anchoredMonth);
    const memIdx = APP_DATA.mementos.findIndex(mem => {
      // Find all months that match the timing string (e.g. "May/June")
      const monthIndices = APP_DATA.months
        .map((m, i) => mem.timing.toLowerCase().includes(m.name.toLowerCase()) ? i : -1)
        .filter(i => i !== -1);
      
      if (monthIndices.length === 0) return false;
      const startIdx = Math.min(...monthIndices);
      const endIdx = Math.max(...monthIndices);
      return anchoredMonthIdx >= startIdx && anchoredMonthIdx <= endIdx;
    });
    if (memIdx !== -1) setExpandedMementos(memIdx);
  }, [anchoredMonth]);

  // Group Mementos logic
  const mementosGroups = useMemo(() => {
    const anchoredMonthIdx = APP_DATA.months.findIndex(m => m.id === anchoredMonth);
    const history = [];
    const active = [];

    APP_DATA.mementos.forEach((mem, index) => {
      const memMonthIdx = APP_DATA.months.findIndex(m => mem.timing.toLowerCase().includes(m.name.toLowerCase()));
      const isHistory = memMonthIdx !== -1 && memMonthIdx < anchoredMonthIdx - 1;
      const memWithIdx = { ...mem, originalIdx: index };
      if (isHistory) history.push(memWithIdx);
      else active.push(memWithIdx);
    });
    return { history, active };
  }, [anchoredMonth]);

  // Group Roadmap Tasks
  const groupedTasks = useMemo(() => {
    if (!activeMonthData) return null;
    
    const groups = {
      critical: [],
      timeline: [],
      strategy: []
    };

    activeMonthData.tasks.forEach(task => {
      const t = task.text;
      
      // 1. Strategies (Non-actionable tips)
      if (t.startsWith('Strategy:') || t.startsWith('Focus:') || t.startsWith('Optimization:') || t.startsWith('Boss Strategy:')) {
        groups.strategy.push(task);
        return;
      }

      // 2. Strict Critical: Deadlines, Rank Requirements, Palace Milestones
      if (t.includes('DEADLINE') || t.includes('MUST be') || t.includes('Secure Route') || t.includes('Calling Card') || t.includes('CRITICAL')) {
        groups.critical.push(task);
      } 
      // 3. Standard Timeline
      else {
        groups.timeline.push(task);
      }
    });

    // Helper to sort by date (Academic Year: April=4 ... Jan=13, Feb=14, Mar=15)
    const getDateValue = (text) => {
      const match = text.match(/^(\d{1,2})\/(\d{1,2})/);
      if (match) {
        let m = parseInt(match[1]);
        const d = parseInt(match[2]);
        if (m < 4) m += 12; // Treat Jan-Mar as next year
        return m * 100 + d;
      }
      return 99999; // Undated items at the bottom
    };

    groups.timeline.sort((a, b) => getDateValue(a.text) - getDateValue(b.text));
    
    return groups;
  }, [activeMonthData]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-2 md:p-8">
      <header className="max-w-6xl mx-auto mb-4 md:mb-8 border-b-4 md:border-b-8 border-red-600 pb-4 md:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-6xl font-black text-red-600 tracking-tighter italic uppercase flex items-baseline justify-center lg:justify-start flex-wrap gap-2">
            <span>P5</span>
            <span className="text-white not-italic text-lg md:text-2xl font-bold tracking-normal uppercase">Tracker</span>
            <span className="bg-red-600 text-black px-1.5 py-0.5 md:px-2 md:py-0.5 rounded not-italic text-[10px] md:text-[11px] font-black tracking-tighter align-middle ml-1 md:ml-2 border border-red-900 shadow-sm">
              v{APP_VERSION}
            </span>
          </h1>
          <p className="text-neutral-500 mt-1 md:mt-2 font-mono text-[8px] md:text-[10px] tracking-[0.4em] hidden md:block">Integrated Strategy Compendium</p>
        </div>
        <div className="flex gap-2 md:gap-4 flex-wrap justify-center items-center">
            <a href={import.meta.env.BASE_URL} className="border border-neutral-700 px-3 py-1.5 md:py-3 text-[10px] md:text-xs font-bold text-neutral-200 hover:border-red-500 hover:text-white">All games</a>
            <a href={`${import.meta.env.BASE_URL}p3/`} className="border border-neutral-700 px-3 py-1.5 md:py-3 text-[10px] md:text-xs font-bold text-neutral-200 hover:border-sky-500 hover:text-white">P3 Reload</a>
            <a 
              href="https://ko-fi.com/K3K11RWTSL" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('support-link-click', { location: 'header' })}
              className="flex items-center gap-2 bg-[#FF5E5B] hover:bg-white text-white hover:text-black px-3 py-1.5 md:px-6 md:py-3 font-bold text-[10px] md:text-xs transition-all italic shadow-xl shadow-red-900/20 border-b-2 md:border-b-4 border-[#c44040] hover:border-neutral-300 group"
              title="Support the Dev"
            >
              <Heart className="w-3 md:w-4 h-3 md:h-4 fill-current group-hover:text-red-500 transition-colors" /> 
              <span className="hidden md:inline">Support the Dev</span><span className="md:hidden">Support</span>
            </a>
            <button 
              onClick={() => { setSaveModal(true); trackEvent('sync-terminal-open'); }} 
              className="flex items-center gap-2 bg-red-600 hover:bg-white text-black px-3 py-1.5 md:px-6 md:py-3 font-black uppercase text-[10px] md:text-xs transition-all italic shadow-xl shadow-red-900/20 active:scale-95 border-b-2 md:border-b-4 border-red-900"
            >
              <Save className="w-3 md:w-4 h-3 md:h-4" /> <span className="hidden md:inline">Sync Terminal</span><span className="md:hidden">Sync</span>
            </button>
        </div>
      </header>

      <nav aria-label="Tracker sections" className="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:mb-8 flex justify-between gap-1 bg-neutral-900/90 backdrop-blur-xl p-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] border-t border-neutral-800 md:bg-neutral-900 md:p-1 md:border md:rounded-2xl md:shadow-2xl">
        <TabButton active={activeTab === 'cheatsheet'} onClick={() => setActiveTab('cheatsheet')} label="Briefing" icon={BookOpen} />
        <TabButton active={activeTab === 'months'} onClick={() => setActiveTab('months')} label="Calendar" icon={Calendar} />
        <TabButton active={activeTab === 'confidants'} onClick={() => setActiveTab('confidants')} label="Confidants" icon={Users} />
        <TabButton active={activeTab === 'metaverse'} onClick={() => setActiveTab('metaverse')} label="Metaverse" icon={Sword} />
        <TabButton active={activeTab === 'more' || activeTab === 'registry_view' || activeTab === 'library_view'} onClick={() => setActiveTab('more')} label="More" icon={Menu} />
      </nav>

      <main tabIndex={-1} className="max-w-6xl mx-auto pb-48 md:pb-24">
        {saveWarning && <section role="alert" className="mb-5 rounded-xl border border-amber-600 bg-amber-950/40 p-4 text-sm text-amber-100">
          <h2 className="font-bold">Keep a backup of your progress</h2><p className="mt-2 leading-relaxed">{saveWarning}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={exportFile} className="rounded-lg border border-amber-500 px-3 py-3 font-semibold">Download current progress</button>
            {loadedSave.original && <button onClick={exportOriginal} className="rounded-lg border border-amber-500 px-3 py-3 font-semibold">Download original stored data</button>}
            <button onClick={() => setSaveModal(true)} className="px-3 py-3 underline">Open Sync</button>
          </div>
        </section>}
        {showWelcome && activeTab === 'cheatsheet' && <WelcomeNotice
          onCalendar={() => { dismissWelcome(); setActiveTab('months'); trackEvent('welcome_calendar_opened'); }}
          onHelp={() => { setShowOnboarding(true); trackEvent('help-open'); }}
          onDismiss={() => { dismissWelcome(); trackEvent('welcome_dismissed'); }}
        />}
        {hasNewRelease && <section aria-label="Latest update" className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-neutral-700 px-4 py-3 text-sm text-neutral-300">
          <p className="flex-1">Updated: {RELEASE_NOTES[0]?.title}</p>
          <button onClick={() => { setHasNewRelease(false); setChangelogFullHistory(false); setShowChangelog(true); trackEvent('changelog-open'); }} className="min-h-11 px-2 text-white underline">What's new</button>
          <button onClick={() => setHasNewRelease(false)} aria-label="Dismiss update notice" className="min-h-11 px-2 underline">Dismiss</button>
        </section>}
        <GuideLinks view={activeTab} />
        
        {/* CHEATSHEET VIEW */}
        {activeTab === 'cheatsheet' && (
          <div className="space-y-6 md:space-y-12 animate-in fade-in duration-500">
            {/* Protagonist Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-4 md:p-6 shadow-xl">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-red-500" /> Protagonist Social Stats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
                  {SOCIAL_STATS.map(stat => {
                    const Icon = STAT_ICONS[stat.id];
                    const currentLvl = socialStats[stat.id];
                    return (
                      <div key={stat.id} className="flex flex-col gap-2 md:gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3 h-3 text-neutral-500" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{stat.id}</span>
                          </div>
                          <span className="text-xs font-black text-red-500 italic">Lv.{currentLvl}</span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(lvl => (
                            <button
                              key={lvl}
                              onClick={() => updateStat(stat.id, lvl)}
                              aria-label={`Set ${stat.id} to level ${lvl}`}
                              aria-pressed={lvl === currentLvl}
                              title={`${stat.id} level ${lvl}`}
                              className={`h-6 flex-1 rounded-md transition-all ${
                                lvl <= currentLvl ? stat.color : 'bg-neutral-800 hover:bg-neutral-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <RoyalRequirements ranks={confidantRanks} />
            </div>

            <SupportCard location="briefing" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
             <div className="space-y-3 md:space-y-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3 md:p-6">
                   <h3 className="text-lg md:text-2xl font-black italic text-red-600 uppercase mb-3 md:mb-6 flex items-center gap-2">
                     <Clock className="w-4 h-4 md:w-6 md:h-6" /> Daily Routine
                   </h3>
                   <div className="space-y-2 md:space-y-4">
                     {APP_DATA.tips.daily.map((tip, i) => (
                       <div key={i} className="flex gap-2 md:gap-4 p-2 md:p-4 bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-800">
                          <div className="p-1.5 md:p-3 bg-neutral-900 rounded-lg md:rounded-xl h-fit border border-neutral-700">
                             <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-500" />
                          </div>
                          <div>
                             <div className="font-bold text-white tracking-tight text-sm md:text-base leading-tight">{tip.text}</div>
                             <div className="text-xs text-neutral-500 mt-1">{tip.note}</div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3 md:p-6">
                   <h3 className="text-lg md:text-2xl font-black italic text-blue-500 uppercase mb-3 md:mb-6 flex items-center gap-2">
                     <Calendar className="w-4 h-4 md:w-6 md:h-6" /> Weekly / Time Specific
                   </h3>
                   <div className="space-y-2 md:space-y-4">
                     {APP_DATA.tips.weekly.map((tip, i) => (
                       <div key={i} className="flex gap-2 md:gap-4 p-2 md:p-4 bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-800">
                          <div className="p-1.5 md:p-3 bg-neutral-900 rounded-lg md:rounded-xl h-fit border border-neutral-700">
                             <Calendar className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-500" />
                          </div>
                          <div>
                             <div className="font-bold text-white tracking-tight text-sm md:text-base leading-tight">{tip.text}</div>
                             <div className="text-xs text-neutral-500 mt-1">{tip.note}</div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
             </div>

             <div className="space-y-3 md:space-y-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3 md:p-6">
                   <h3 className="text-lg md:text-2xl font-black italic text-yellow-500 uppercase mb-3 md:mb-6 flex items-center gap-2">
                     <Sword className="w-4 h-4 md:w-6 md:h-6" /> Combat & Systems
                   </h3>
                   <div className="space-y-2 md:space-y-4">
                     {APP_DATA.tips.combat.map((tip, i) => (
                       <div key={i} className="flex gap-2 md:gap-4 p-2 md:p-4 bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-800">
                          <div className="p-1.5 md:p-3 bg-neutral-900 rounded-lg md:rounded-xl h-fit border border-neutral-700">
                             <Sword className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-500" />
                          </div>
                          <div>
                             <div className="font-bold text-white tracking-tight text-sm md:text-base leading-tight">{tip.text}</div>
                             <div className="text-xs text-neutral-500 mt-1">{tip.note}</div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3 md:p-6">
                   <h3 className="text-lg md:text-2xl font-black italic text-neutral-400 uppercase mb-3 md:mb-6 flex items-center gap-2">
                     <Users className="w-4 h-4 md:w-6 md:h-6" /> Weather & Environment
                   </h3>
                   <div className="space-y-2 md:space-y-4">
                     {APP_DATA.tips.weather.map((tip, i) => (
                       <div key={i} className="flex gap-2 md:gap-4 p-2 md:p-4 bg-neutral-800/50 rounded-xl md:rounded-2xl border border-neutral-800">
                          <div className="p-1.5 md:p-3 bg-neutral-900 rounded-lg md:rounded-xl h-fit border border-neutral-700">
                             <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-neutral-400" />
                          </div>
                          <div>
                             <div className="font-bold text-white tracking-tight text-sm md:text-base leading-tight">{tip.text}</div>
                             <div className="text-xs text-neutral-500 mt-1">{tip.note}</div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
            </div>

            {/* SCHOOL ANSWERS */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-3 md:p-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
                 <h3 className="text-lg md:text-2xl font-black italic text-white uppercase flex items-center gap-2">
                   <Book className="w-4 h-4 md:w-6 md:h-6 text-neutral-500" /> School Answers
                 </h3>
                 <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                   <input 
                     type="text" 
                     placeholder="Search answers..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-black border border-neutral-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:border-red-600 outline-none transition-colors"
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 max-h-64 md:max-h-96 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
                 {classroomAnswers
                   .filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()) || t.month.toLowerCase().includes(searchTerm.toLowerCase()))
                   .map((t, i) => (
                   <div key={i} className="flex gap-3 p-3 bg-neutral-800/30 rounded-xl border border-neutral-800/50 hover:border-neutral-600 transition-colors">
                      <div className="text-xs font-black text-neutral-500 w-12 md:w-16 shrink-0 pt-0.5">{t.month}</div>
                      <div className="text-sm text-neutral-300 font-bold leading-snug">{t.text}</div>
                   </div>
                 ))}
               </div>
            </div>

            {/* CROSSWORD ANSWERS */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col border-t-4 border-t-yellow-600">
              <div className="p-4 md:p-8 border-b border-neutral-800 bg-black/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-800 text-yellow-500">
                      <Book className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-3xl font-black uppercase text-white tracking-tight italic">Crossword Answers</h3>
                      <p className="text-xs md:text-sm text-neutral-500 font-semibold mt-1 tracking-wider uppercase">Sequential Progression Tracking</p>
                    </div>
                  </div>
                  <div className="bg-neutral-800 px-4 py-2 rounded-2xl border border-neutral-700">
                    <span className="text-xs font-black text-white italic">Puzzles Completed: {Object.keys(checkedItems).filter(k => k.startsWith('cw_ans_')).length} / 38</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-neutral-400 mt-4 leading-relaxed max-w-3xl">
                  Crosswords in Royal are sequential. They always appear in this order, regardless of the calendar date. Check them off here to update your Calendar hints.
                </p>
              </div>

              <div className="p-4 md:p-8 max-h-[400px] overflow-y-auto custom-scrollbar bg-black/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.isArray(CROSSWORD_DATA) && CROSSWORD_DATA.map((cw, idx) => (
                    <div 
                      key={cw.id}
                      onClick={() => toggleItem(cw.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                        checkedItems[cw.id] 
                          ? 'bg-neutral-950/50 border-neutral-800 opacity-40' 
                          : 'bg-neutral-800/30 border-neutral-800 hover:bg-neutral-800/50 hover:border-yellow-900/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${checkedItems[cw.id] ? 'bg-neutral-800 text-neutral-500' : 'bg-yellow-600 text-black'}`}>
                        {idx + 1}
                      </div>
                                              <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-bold truncate ${checkedItems[cw.id] ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>{cw.q}</div>
                                                <div className={`text-sm font-black italic ${checkedItems[cw.id] ? 'text-neutral-600' : 'text-white'}`}>{cw.a}</div>
                                              </div>                      {checkedItems[cw.id] ? <CheckSquare className="w-4 h-4 text-green-500" /> : <Square className="w-4 h-4 text-neutral-700" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Header Navigation */}
        {activeTab === 'months' && (
          <div className="mb-4 md:mb-8 bg-neutral-900 border border-neutral-800 rounded-3xl p-3 md:p-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Calendar className="w-20 h-20 md:w-32 md:h-32" />
            </div>

            <div className="flex items-center gap-4 md:gap-6 z-10 w-full md:w-auto justify-between">
              <button 
                onClick={() => {
                  const idx = APP_DATA.months.findIndex(m => m.id === currentMonth);
                  if (idx > 0) setCurrentMonth(APP_DATA.months[idx - 1].id);
                }}
                disabled={APP_DATA.months.findIndex(m => m.id === currentMonth) === 0}
                className="p-2 md:p-3 rounded-full hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 rotate-90" />
              </button>

              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter">{activeMonthData?.name}</h2>
                {anchoredMonth === currentMonth ? (
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-1 text-red-500 animate-pulse">
                    <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Current Location</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 md:gap-2 mt-1 md:mt-2">
                    <button 
                      onClick={() => setAnchoredMonth(currentMonth)}
                      className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg shadow-red-900/20"
                    >
                      <Target className="w-2.5 h-2.5 md:w-3 md:h-3" /> Set as Active
                    </button>
                    <button 
                      onClick={() => setCurrentMonth(anchoredMonth)}
                      className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-2 h-2" /> Return to {anchoredMonth}
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  const idx = APP_DATA.months.findIndex(m => m.id === currentMonth);
                  if (idx < APP_DATA.months.length - 1) setCurrentMonth(APP_DATA.months[idx + 1].id);
                }}
                disabled={APP_DATA.months.findIndex(m => m.id === currentMonth) === APP_DATA.months.length - 1}
                className="p-2 md:p-3 rounded-full hover:bg-neutral-800 disabled:opacity-30 transition-colors"
              >
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 -rotate-90" />
              </button>
            </div>

            <div className="flex gap-8 text-right z-10 hidden md:flex">
               <div>
                  <div className="text-[10px] text-neutral-500 font-bold tracking-widest">Confidant Targets</div>
                  <div className="text-2xl font-black text-white">{activeMonthData?.smartTargets.length}</div>
               </div>
               <div>
                  <div className="text-[10px] text-neutral-500 font-bold tracking-widest">Total Tasks</div>
                  <div className="text-2xl font-black text-white">{activeMonthData?.tasks.length}</div>
               </div>
            </div>
          </div>
        )}
        
        {/* ROADMAP VIEW */}
        {activeTab === 'months' && activeMonthData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SupportCard location="calendar" />
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col border-t-4 border-t-red-600">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-black italic text-red-600 uppercase">{activeMonthData.name} Protocol</h3>
                </div>
                
                {/* Tasks Section */}
                <div className="space-y-6 mb-8">
                  {/* Mission Critical */}
                  {groupedTasks.critical.length > 0 && (
                    <div className="bg-red-950/20 border border-red-900/50 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 p-3 bg-red-900/20 border-b border-red-900/30">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Mission Critical</h4>
                      </div>
                      <div className="p-2 space-y-2">
                        {groupedTasks.critical.map((task, idx) => (
                          <div 
                            key={`crit-${idx}`}
                            onClick={() => toggleItem(task.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              checkedItems[task.id] 
                                ? 'bg-red-950/10 border-red-900/10 opacity-50' 
                                : 'bg-red-900/10 border-red-900/30 hover:bg-red-900/20'
                            }`}
                          >
                            {checkedItems[task.id] ? <CheckSquare className="w-5 h-5 text-red-600/50" /> : <Square className="w-5 h-5 text-red-500" />}
                            <span className={`text-[11px] md:text-xs font-bold text-red-200 ${checkedItems[task.id] ? 'line-through' : ''}`}>{task.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Standard Timeline */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Timeline</h4>
                    {groupedTasks.timeline.map((task, idx) => {
                      const getStyle = (t) => {
                        if (t.includes('Answer:') || t.includes('Exam:') || t.includes('Crossword:')) 
                          return { icon: Book, color: 'text-yellow-500', bg: 'bg-yellow-900/5', border: 'border-yellow-900/20' };
                        if (t.includes('Mementos') || t.includes('Palace') || t.includes('Mission') || t.includes('Infiltration'))
                          return { icon: Target, color: 'text-purple-500', bg: 'bg-purple-900/5', border: 'border-purple-900/20' };
                        if (t.match(/^\d{1,2}\/\d{1,2}/))
                          return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-900/5', border: 'border-blue-900/20' };
                        return { icon: Circle, color: 'text-neutral-500', bg: 'bg-neutral-800/20', border: 'border-neutral-800' };
                      };
                      
                      const style = getStyle(task.text);
                      const StyleIcon = style.icon;

                      return (
                        <div 
                          key={`time-${idx}`} 
                          onClick={() => toggleItem(task.id)} 
                          className={`p-3 md:p-4 rounded-xl border flex items-center gap-3 md:gap-4 cursor-pointer transition-all ${
                            isTaskChecked(task) 
                              ? 'opacity-30 border-neutral-800 bg-transparent' 
                              : `${style.bg} ${style.border} hover:border-neutral-600`
                          }`}
                        >
                          {isTaskChecked(task) ? <CheckSquare className="w-5 h-5 text-green-500 shrink-0" /> : <Square className={`w-5 h-5 shrink-0 ${style.color}`} />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold leading-tight ${isTaskChecked(task) ? 'text-neutral-600 line-through' : 'text-neutral-300'}`}>
                                {task.text}
                                {!isTaskChecked(task) && task.text.includes('Crossword') && (
                                  <span className="text-red-500 ml-2 font-black italic">
                                    Next: "{CROSSWORD_DATA.find(cw => !checkedItems[cw.id])?.a || 'Complete'}"
                                  </span>
                                )}
                              </span>
                              {!checkedItems[task.id] && !style.icon.name?.includes('Circle') && <StyleIcon className={`w-3.5 h-3.5 ${style.color} opacity-50`} />}
                            </div>
                            {task.isOverdue && <div className="text-xs font-bold text-red-500 mt-1 tracking-widest flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Overdue from {task.sourceMonth}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Strategic Briefing (Non-actionable) */}
                  {groupedTasks.strategy.length > 0 && (
                    <div className="mt-8 bg-blue-900/20 border border-blue-800/50 rounded-2xl overflow-hidden">
                       <div className="flex items-center gap-2 p-4 bg-blue-800/20 border-b border-blue-800/30">
                          <Lightbulb className="w-5 h-5 text-blue-400" />
                          <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Strategic Briefing</h4>
                       </div>
                       <div className="p-4 space-y-3">
                          {groupedTasks.strategy.map((task, idx) => (
                             <div key={`strat-${idx}`} className="flex gap-4 items-start">
                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-xs md:text-sm text-blue-200/90 font-medium leading-relaxed">
                                  {task.text}
                                </span>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>

                {/* Targets Section */}
                <div className="pt-6 border-t border-neutral-800">
                  <h4 className="text-xs font-black text-red-500 mb-4 uppercase tracking-[0.3em]">Critical Ranks</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeMonthData.smartTargets.map((target, idx) => {
                      const arcanaKey = target.arc.split(' (')[0];
                      const currentRank = confidantRanks[arcanaKey] || 0;
                      const isBehind = currentRank < target.r;
                      
                      return (
                        <div 
                          key={`${target.arc}-${idx}`} 
                          className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                            !isBehind 
                              ? 'bg-green-950/20 border-green-900/40 text-green-500' 
                              : 'bg-red-950/20 border-red-900/40 text-red-500 shadow-inner'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="truncate">{target.arc}</span>
                            {isBehind && !target.isCurrent && (
                              <span className="bg-red-600 text-black px-1.5 py-0.5 rounded-[4px] text-[10px] font-black uppercase shrink-0 ml-1">Catch Up</span>
                            )}
                          </div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-base font-black italic">Target: {target.r}</span>
                            <span className="opacity-50 text-[10px]">(Curr: {currentRank})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONFIDANTS VIEW */}
        {activeTab === 'confidants' && (
          <div className="animate-in fade-in duration-500">
            {/* Mobile Compact List View */}
            <div className="flex flex-col gap-2 md:hidden">
              {APP_DATA.confidants.map(c => {
                const isExpanded = expandedGuides[c.arcana];
                const rank = confidantRanks[c.arcana] || 0;
                const gate = isGateBlocked(c.arcana, rank);
                const isMax = rank >= c.target;

                return (
                  <div key={c.arcana} className={`bg-neutral-900 border ${isExpanded ? 'border-red-600' : 'border-neutral-800'} rounded-xl overflow-hidden shadow-lg transition-all`}>
                    {/* Compact Header */}
                    <div 
                      onClick={() => toggleGuide(c.arcana)}
                      className="p-3 flex items-center justify-between gap-2 cursor-pointer active:bg-neutral-800"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${isMax ? 'bg-red-600 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                          {rank}
                        </div>
                        
                        {/* Rank Controls (Inline) */}
                        <div className="flex shrink-0 items-center gap-1">
                           <button 
                             aria-label={`Decrease ${c.arcana} rank`}
                             onClick={(e) => { e.stopPropagation(); updateRank(c.arcana, rank - 1); }} 
                             className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-red-600 rounded text-neutral-400 hover:text-white font-bold text-lg active:scale-90 transition-transform"
                           >-</button>
                           <button 
                             aria-label={`Increase ${c.arcana} rank`}
                             onClick={(e) => { e.stopPropagation(); updateRank(c.arcana, rank + 1); }} 
                             className="w-8 h-8 flex items-center justify-center bg-neutral-800 hover:bg-red-600 rounded text-neutral-400 hover:text-white font-bold text-lg active:scale-90 transition-transform"
                           >+</button>
                        </div>

                        <div className="min-w-0">
                          <div className="font-black text-white uppercase text-sm leading-none truncate">{c.arcana}</div>
                          <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider truncate">{c.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {gate && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                        <button aria-label={`${isExpanded ? 'Close' : 'Open'} ${c.arcana} guide`} aria-expanded={!!isExpanded} onClick={event => { event.stopPropagation(); toggleGuide(c.arcana); }} className="text-xs font-bold text-neutral-300 px-2 py-2 rounded border border-neutral-700 hover:border-red-600">{isExpanded ? 'Close' : 'Guide'}</button>
                      </div>
                    </div>

                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <div className="bg-black/20 border-t border-neutral-800 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Notes & Warnings */}
                        <div className="space-y-2">
                           {gate && (
                              <div className="flex items-center gap-2 text-[10px] font-black text-red-500 bg-red-950/20 p-2 rounded border border-red-900/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span>LOCKED: Requires {gate.stat} Lv.{gate.lvl}</span>
                              </div>
                           )}
                           <p className="text-xs text-neutral-400 italic leading-relaxed">{c.notes}</p>
                           {c.deadline && <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">⚠️ Deadline: {c.deadline}</div>}
                        </div>

                        {/* Interaction Guide Data */}
                        {CONFIDANT_INTERACTIONS[c.arcana] && (
                          <div className="pt-4 border-t border-neutral-800 space-y-3">
                             {/* Best Gifts */}
                             <div>
                                <h5 className="text-xs font-black text-blue-500 uppercase mb-2 flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> Best Gifts</h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {CONFIDANT_INTERACTIONS[c.arcana].bestGifts.map(g => (
                                    <span key={g} className="px-2.5 py-1 bg-neutral-800 rounded text-[11px] text-neutral-300 border border-neutral-700">{g}</span>
                                  ))}
                                </div>
                             </div>

                             {/* Best Responses */}
                             <div>
                                <h5 className="text-xs font-black text-red-500 uppercase mb-2 flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Best Responses (Rank {rank + 1})</h5>
                                <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 space-y-2">
                                  {Array.isArray(CONFIDANT_INTERACTIONS[c.arcana].ranks[rank + 1]) 
                                    ? CONFIDANT_INTERACTIONS[c.arcana].ranks[rank + 1].map((step, idx) => (
                                        <p key={idx} className="text-sm text-neutral-300 border-b border-neutral-800 last:border-0 pb-1.5 last:pb-0">{step}</p>
                                      ))
                                    : <p className="text-xs text-neutral-500 italic">No dialogue data for this rank.</p>
                                  }
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black border-b border-neutral-800">
                    <th className="p-8 text-xs font-black text-neutral-500 uppercase italic tracking-[0.2em]">Entity</th>
                    <th className="p-8 text-xs font-black text-neutral-500 uppercase italic tracking-[0.2em] text-center">Current Rank</th>
                    <th className="p-8 text-xs font-black text-neutral-500 uppercase italic tracking-[0.2em]">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {APP_DATA.confidants.map(c => (
                    <React.Fragment key={c.arcana}>
                      <tr 
                        className={`hover:bg-neutral-800/30 group cursor-pointer ${expandedGuides[c.arcana] ? 'bg-neutral-800/20' : ''}`}
                        onClick={() => toggleGuide(c.arcana)}
                      >
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-black text-red-600 italic text-2xl tracking-tighter group-hover:translate-x-2 transition-transform">{c.arcana}</div>
                              <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">{c.name}</div>
                              
                              {/* Stat Gate Warning (Desktop) */}
                              {(() => {
                                const gate = isGateBlocked(c.arcana, confidantRanks[c.arcana]);
                                if (gate) {
                                  return (
                                    <div className="mt-2 inline-flex items-center gap-1.5 bg-red-950/30 border border-red-900/50 px-2 py-1 rounded-lg">
                                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                      <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Blocked: {gate.stat} Lv.{gate.lvl} Required</span>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                            {CONFIDANT_INTERACTIONS[c.arcana] && <button aria-label={`${expandedGuides[c.arcana] ? 'Close' : 'Open'} ${c.arcana} guide`} aria-expanded={!!expandedGuides[c.arcana]} onClick={event => { event.stopPropagation(); toggleGuide(c.arcana); }} className="text-xs font-bold text-neutral-300 px-3 py-2 rounded border border-neutral-700 hover:border-red-600">{expandedGuides[c.arcana] ? 'Close' : 'Guide'}</button>}
                          </div>
                        </td>
                        <td className="p-8 flex justify-center">
                          <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => updateRank(c.arcana, (confidantRanks[c.arcana] || 0) - 1)} 
                              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 text-3xl font-black transition-colors"
                            >
                              -
                            </button>
                            <span className="p-2 text-4xl font-black text-center text-red-600 w-24">{confidantRanks[c.arcana] || 0}</span>
                            <button 
                              onClick={() => updateRank(c.arcana, (confidantRanks[c.arcana] || 0) + 1)} 
                              className="p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 text-3xl font-black transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-8 text-xs text-neutral-400 max-w-md italic leading-relaxed">
                          {c.notes}
                          {c.deadline && <div className="text-red-500 font-black mt-3 uppercase text-[9px] border-t border-red-900/20 pt-3 tracking-widest">DEADLINE: {c.deadline}</div>}
                        </td>
                      </tr>
                      {expandedGuides[c.arcana] && CONFIDANT_INTERACTIONS[c.arcana] && (
                        <tr className="bg-neutral-950/50">
                          <td colSpan="3" className="p-8 pt-0">
                            <div className="grid grid-cols-2 gap-8 border-t border-neutral-800 pt-8 animate-in slide-in-from-top-2 duration-300">
                               <div>
                                  <h5 className="text-xs font-black text-blue-500 uppercase mb-4 flex items-center gap-2"><Gift className="w-4 h-4" /> Recommended Gifts</h5>
                                  <div className="flex flex-wrap gap-2 mb-6">
                                     {CONFIDANT_INTERACTIONS[c.arcana].bestGifts.map(g => (
                                       <span key={g} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-[10px] text-neutral-300">{g}</span>
                                     ))}
                                  </div>

                                  {/* Strategic Roadmap Section (Desktop) */}
                                  {c.monthlyTargets && Object.keys(c.monthlyTargets).length > 0 && (
                                    <div className="pt-6 border-t border-neutral-800/50">
                                       <h5 className="text-xs font-black text-yellow-500 uppercase mb-4 flex items-center gap-2"><Trophy className="w-4 h-4" /> Strategic Roadmap</h5>
                                       <div className="flex flex-wrap gap-2">
                                          {Object.entries(c.monthlyTargets).map(([mId, rank]) => {
                                            const monthName = APP_DATA.months.find(m => m.id === mId)?.name || mId;
                                            const isMet = (confidantRanks[c.arcana] || 0) >= rank;
                                            const isSelected = currentMonth === mId;
                                            return (
                                              <div key={mId} className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${isSelected ? 'border-yellow-500 bg-yellow-500/10' : 'border-neutral-800 bg-neutral-900/50 opacity-60'}`}>
                                                <span className={`text-xs uppercase font-black ${isSelected ? 'text-yellow-500' : 'text-neutral-500'}`}>{monthName}</span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-black italic">Rank {rank}</span>
                                                  {isMet ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-2 h-2 text-neutral-700" />}
                                                </div>
                                              </div>
                                            );
                                          })}
                                       </div>
                                    </div>
                                  )}
                               </div>
                               <div>
                                  <h5 className="text-xs font-black text-red-500 uppercase mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Next Rank Interaction: {confidantRanks[c.arcana] + 1}</h5>
                                  <div className="space-y-2 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
                                     {Array.isArray(CONFIDANT_INTERACTIONS[c.arcana].ranks[confidantRanks[c.arcana] + 1]) 
                                       ? CONFIDANT_INTERACTIONS[c.arcana].ranks[confidantRanks[c.arcana] + 1].map((step, idx) => (
                                           <p key={idx} className="text-xs text-neutral-400 leading-relaxed border-b border-neutral-800 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                                              {step}
                                           </p>
                                         ))
                                       : <p className="text-xs text-neutral-400 italic">No data for this rank or max rank reached.</p>
                                     }
                                  </div>
                                  <p className="text-xs text-neutral-600 italic mt-4">{CONFIDANT_INTERACTIONS[c.arcana].tips}</p>
                               </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* METAVERSE VIEW */}
        {activeTab === 'metaverse' && (
          <div className="animate-in fade-in duration-500 mb-6">
            <div className="flex justify-center">
              <div className="bg-neutral-900 p-1 rounded-xl border border-neutral-800 flex gap-1">
                <button 
                  onClick={() => setMetaverseView('palaces')}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${metaverseView === 'palaces' ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                >
                  <MapPin className="w-4 h-4" /> Palaces
                </button>
                <button 
                  onClick={() => setMetaverseView('mementos')}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${metaverseView === 'mementos' ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
                >
                  <Target className="w-4 h-4" /> Mementos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PALACES CONTENT */}
        {activeTab === 'metaverse' && metaverseView === 'palaces' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             {(() => {
               const anchoredMonthIdx = APP_DATA.months.findIndex(m => m.id === anchoredMonth);
               
               const historyPalaces = [];
               const activePalaces = [];

               APP_DATA.palaces.forEach((p, idx) => {
                 const palaceStartMonthIdx = APP_DATA.months.findIndex(m => m.id === p.monthId);
                 const palaceEndMonthIdx = p.deadlineMonth 
                   ? APP_DATA.months.findIndex(m => m.id === p.deadlineMonth)
                   : palaceStartMonthIdx;
                 
                 const isHistory = palaceEndMonthIdx < anchoredMonthIdx;
                 if (isHistory) historyPalaces.push({ ...p, originalIdx: idx });
                 else activePalaces.push({ ...p, originalIdx: idx });
               });

               return (
                 <>
                   {historyPalaces.length > 0 && (
                     <button 
                       onClick={() => { setShowArchived(!showArchived); trackEvent('palace-history-toggle', { state: !showArchived }); }}
                       className="w-full py-3 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                     >
                       {showArchived ? 'Hide' : 'Show'} {historyPalaces.length} Completed {historyPalaces.length === 1 ? 'Palace' : 'Palaces'}
                       <ChevronDown className={`w-4 h-4 transition-transform ${showArchived ? 'rotate-180' : ''}`} />
                     </button>
                   )}

                   {(showArchived ? [...historyPalaces, ...activePalaces] : activePalaces).map((p) => {
                     const idx = p.originalIdx;
                     const palaceStartMonthIdx = APP_DATA.months.findIndex(m => m.id === p.monthId);
                     const palaceEndMonthIdx = p.deadlineMonth 
                       ? APP_DATA.months.findIndex(m => m.id === p.deadlineMonth)
                       : palaceStartMonthIdx;
                     
                     const isHistory = palaceEndMonthIdx < anchoredMonthIdx;
                     const isCurrent = anchoredMonthIdx >= palaceStartMonthIdx && anchoredMonthIdx <= palaceEndMonthIdx;
               
                     return (
                       <div key={p.id} className={`bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl transition-all ${isHistory ? 'opacity-60 grayscale' : ''}`}>
                         <div className="p-4 md:p-8 cursor-pointer hover:bg-neutral-800 transition-all flex justify-between items-center" onClick={() => setExpandedPalace(expandedPalace === idx ? null : idx)}>
                           <div className="flex items-center gap-3 md:gap-8">
                             <span className={`text-2xl md:text-5xl font-black italic opacity-20 ${isCurrent ? 'text-red-600' : 'text-neutral-500'}`}>0{idx+1}</span>
                             <div>
                               <div className="flex items-center gap-2 md:gap-3">
                                 <h3 className="text-lg md:text-3xl font-black uppercase text-white tracking-tighter leading-tight">{p.name}</h3>
                                 {isCurrent && <span className="px-1.5 py-0.5 bg-red-600 text-white text-[8px] font-black rounded uppercase animate-pulse">Active</span>}
                               </div>
                               <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
                                  <span className="text-[9px] md:text-[10px] bg-red-900 text-black px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Lvl: {p.lvl}</span>
                                  <span className="text-[9px] md:text-[10px] text-neutral-500 font-black uppercase tracking-widest">{p.threat}</span>
                               </div>
                             </div>
                           </div>
                           <ChevronRight className={`transition-transform w-8 h-8 md:w-10 md:h-10 ${expandedPalace === idx ? 'rotate-90 text-red-600' : 'text-neutral-700'}`} />
                         </div>
                         
                         {expandedPalace === idx && (
                           <div className="p-4 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 bg-black/40 border-t border-neutral-800 animate-in zoom-in-95 duration-300">
                             <div className="mt-4 md:mt-8 space-y-4 md:space-y-6">
                                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-2"><MapPin className="w-4 h-4 md:w-5 md:h-5" /> Will Seed Coords</h4>
                                <div className="space-y-2 md:space-y-3">
                                  {p.seeds.map((s, si) => (
                                    <div key={si} onClick={() => toggleItem(s.id)} className={`p-3 md:p-4 rounded-xl border flex items-center gap-3 md:gap-4 cursor-pointer transition-all ${checkedItems[s.id] ? 'opacity-30 border-neutral-800 bg-black/20' : 'bg-neutral-900/80 border-l-4 border-l-red-600 border-neutral-800 hover:bg-neutral-800'}`}>
                                       {checkedItems[s.id] ? <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Square className="w-4 h-4 text-neutral-600 flex-shrink-0" />}
                                       <div className="text-sm text-neutral-300 leading-tight">{s.text}</div>
                                    </div>
                                  ))}
                                </div>
                             </div>
                             <div className="mt-4 md:mt-8 space-y-4 md:space-y-6">
                                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-2"><Target className="w-4 h-4 md:w-5 md:h-5" /> Palace Personas</h4>
                                <div className="grid gap-2">
                                   {p.personas.map(pers => (
                                     <div key={pers.id} onClick={() => toggleItem(pers.id)} className={`p-2 md:p-3 border rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2 md:gap-3 ${checkedItems[pers.id] ? 'opacity-30 bg-black/20 border-neutral-800 text-green-500' : 'bg-neutral-800 border-neutral-700 hover:border-red-600 text-neutral-200'}`}>
                                        {checkedItems[pers.id] ? <CheckSquare className="w-4 h-4 text-green-500" /> : <Square className="w-4 h-4 text-neutral-600" />}
                                        {pers.name}
                                     </div>
                                   ))}
                                </div>
                             </div>
                             <div className="mt-4 md:mt-8 space-y-4 md:space-y-6">
                                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-2"><Search className="w-4 h-4 md:w-5 md:h-5" /> Field Intel</h4>
                                <p className="text-sm italic text-neutral-400 leading-relaxed bg-red-950/10 p-4 md:p-6 border border-red-900/20 rounded-2xl ring-1 ring-red-500/10">"{p.tips}"</p>
                             </div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </>
               );
             })()}
          </div>
        )}

        {/* MEMENTOS CONTENT */}
        {activeTab === 'metaverse' && metaverseView === 'mementos' && (
          <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500">
            {(() => {
              const { history: historyMem, active: activeMem } = mementosGroups;

              return (
                <>
                  {historyMem.length > 0 && (
                    <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-3xl overflow-hidden">
                      <button 
                        onClick={() => { setShowArchived(!showArchived); trackEvent('mementos-history-toggle', { state: !showArchived }); }}
                        className="w-full p-4 flex items-center justify-between text-neutral-500 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                      >
                        <span>Previous Paths ({historyMem.length})</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showArchived ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showArchived && (
                        <div className="border-t border-neutral-800 p-2 space-y-4">
                          {historyMem.map((mem) => {
                            const idx = mem.originalIdx;
                            return (
                            <div key={mem.id} className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                                <div className={`bg-neutral-950 border-l-[8px] border-red-900 rounded-2xl overflow-hidden shadow-lg`}>
                                  <div 
                                    className="p-3 cursor-pointer hover:bg-neutral-900 transition-all flex justify-between items-center"
                                    onClick={() => setExpandedMementos(expandedMementos === `hist-${idx}` ? null : `hist-${idx}`)}
                                  >
                                    <div className="flex items-center justify-between w-full pr-4">
                                      <div>
                                        <h3 className="text-base font-black italic uppercase text-neutral-400 tracking-tighter">{mem.path}</h3>
                                      </div>
                                      <div className="text-xs font-black text-neutral-600 border border-neutral-800 px-2 py-0.5 rounded">LVL {mem.targetLvl}</div>
                                    </div>
                                    <ChevronRight className={`transition-transform w-4 h-4 text-neutral-600 ${expandedMementos === `hist-${idx}` ? 'rotate-90' : ''}`} />
                                  </div>

                                  {expandedMementos === `hist-${idx}` && (
                                    <div className="p-3 pt-0 space-y-3 bg-black/20 border-t border-neutral-900">
                                      <div className="mt-3">
                                        <div className="grid grid-cols-1 gap-2">
                                          {mem.requests.map(req => (
                                            <div key={req.id} onClick={() => toggleItem(req.id)} className={`bg-black/50 p-3 border rounded-xl cursor-pointer ${checkedItems[req.id] ? 'opacity-30 border-neutral-800' : 'border-neutral-800'}`}>
                                              <div className="flex items-center gap-2 italic mb-1">
                                                  {checkedItems[req.id] ? <CheckSquare className="w-3.5 h-3.5 text-green-500" /> : <Square className="w-3.5 h-3.5 text-neutral-700" />}
                                                  <span className="text-sm font-black text-white uppercase tracking-tighter">{req.name}</span>
                                              </div>
                                              <div className="text-xs font-black text-red-600 ml-5">Reward: {req.reward}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                            </div>
                          )})}
                        </div>
                      )}
                    </div>
                  )}

                  {activeMem.map((mem) => {
                    const idx = mem.originalIdx;
                    return (
                    <div key={mem.id} className={`bg-neutral-900 border-l-[12px] border-red-600 rounded-3xl overflow-hidden shadow-2xl`}>
                      <div 
                        className="p-4 md:p-8 cursor-pointer hover:bg-neutral-800 transition-all flex justify-between items-center"
                        onClick={() => setExpandedMementos(expandedMementos === idx ? null : idx)}
                      >
                        <div className="flex items-center justify-between w-full pr-4 md:pr-8">
                          <div>
                            <h3 className="text-lg md:text-4xl font-black italic uppercase text-red-600 tracking-tighter">{mem.path}</h3>
                            <p className="text-neutral-500 text-xs font-black mt-1 tracking-widest">Timing: {mem.timing}</p>
                          </div>
                          <div className="bg-black px-3 py-1 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-2xl font-black border border-red-900 text-red-500 shadow-[2px_2px_0px_0px_rgba(153,27,27,1)] md:shadow-[4px_4px_0px_0px_rgba(153,27,27,1)]">LVL {mem.targetLvl}</div>
                        </div>
                        <ChevronRight className={`transition-transform w-6 h-6 md:w-10 md:h-10 text-neutral-500 ${expandedMementos === idx ? 'rotate-90 text-red-600' : ''}`} />
                      </div>

                      {expandedMementos === idx && (
                        <div className="p-4 md:p-8 pt-0 space-y-4 md:space-y-6 bg-black/20 border-t border-neutral-800 animate-in zoom-in-95 duration-300">
                          <div className="mt-4 md:mt-6">
                            <h4 className="text-xs md:text-sm font-black text-neutral-400 uppercase tracking-[0.4em] flex items-center gap-2 md:gap-3 mb-4 md:mb-6"><Target className="w-4 h-4 md:w-5 md:h-5 text-red-600" /> Key Missions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              {mem.requests.map(req => (
                                <div key={req.id} onClick={() => toggleItem(req.id)} className={`bg-black/50 p-4 md:p-6 border rounded-3xl transition-all cursor-pointer group ${checkedItems[req.id] ? 'opacity-30 border-neutral-800' : 'border-neutral-800 hover:border-red-600'}`}>
                                  <div className="flex justify-between items-center mb-2 md:mb-4">
                                     <div className="flex items-center gap-2 md:gap-3 italic">
                                        {checkedItems[req.id] ? <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-green-500" /> : <Square className="w-4 h-4 md:w-5 md:h-5 text-neutral-700" />}
                                        <span className="text-base md:text-xl font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tighter">{req.name}</span>
                                     </div>
                                  </div>
                                  <p className="text-sm text-neutral-500 mb-4 md:mb-6 italic leading-relaxed ml-6 md:ml-8">"{req.tip}"</p>
                                  <div className="text-xs font-black text-red-600 ml-6 md:ml-8">Reward: {req.reward}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </>
              );
            })()}
          </div>
        )}

        {/* MORE VIEW (System Menu) */}
        {activeTab === 'more' && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
            {/* Mobile List / Desktop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              
              {/* Registry Access */}
              <button 
                onClick={() => setActiveTab('registry_view')}
                className="group bg-neutral-900 border border-neutral-800 p-4 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-red-600 transition-all shadow-xl relative overflow-hidden flex md:block items-center gap-4"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                  <Ghost className="w-24 h-24" />
                </div>
                <div className="p-3 bg-neutral-800 rounded-xl md:bg-transparent md:p-0">
                  <Ghost className="w-5 h-5 md:w-8 md:h-8 text-red-600 md:mb-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black uppercase italic text-white md:mb-2">Persona Registry</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest leading-tight">
                    Captured Specimens & Demons
                    <span className="hidden md:block mt-2 text-red-600">{registryStats.percent}% Completed</span>
                  </p>
                </div>
              </button>

              {/* Reference Hub Access */}
              <button 
                onClick={() => setActiveTab('library_view')}
                className="group bg-neutral-900 border border-neutral-800 p-4 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-blue-600 transition-all shadow-xl relative overflow-hidden flex md:block items-center gap-4"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                  <Library className="w-24 h-24" />
                </div>
                <div className="p-3 bg-neutral-800 rounded-xl md:bg-transparent md:p-0">
                  <Library className="w-5 h-5 md:w-8 md:h-8 text-blue-500 md:mb-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black uppercase italic text-white md:mb-2">Reference Hub</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest leading-tight">
                    Answers, Calculators, & Guides
                  </p>
                </div>
              </button>

              {/* What's New */}
              <button 
                onClick={() => { setChangelogFullHistory(true); setShowChangelog(true); trackEvent('changelog-open'); }}
                className="group bg-neutral-900 border border-neutral-800 p-4 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-yellow-600 transition-all shadow-xl relative overflow-hidden flex md:block items-center gap-4"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                  <Zap className="w-24 h-24" />
                </div>
                <div className="p-3 bg-neutral-800 rounded-xl md:bg-transparent md:p-0">
                  <Zap className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 md:mb-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black uppercase italic text-white md:mb-2">What's New</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest leading-tight">
                    Update History & Notes
                  </p>
                </div>
              </button>

              {/* Roadmap */}
              <button 
                onClick={() => { setShowRoadmap(true); trackEvent('roadmap-open'); }}
                className="group bg-neutral-900 border border-neutral-800 p-4 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-blue-500 transition-all shadow-xl relative overflow-hidden flex md:block items-center gap-4"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                  <Trophy className="w-24 h-24" />
                </div>
                <div className="p-3 bg-neutral-800 rounded-xl md:bg-transparent md:p-0">
                  <Trophy className="w-5 h-5 md:w-8 md:h-8 text-blue-500 md:mb-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black uppercase italic text-white md:mb-2">Roadmap</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest leading-tight">
                    Future Features & Plans
                  </p>
                </div>
              </button>

              {/* Help */}
              <button 
                onClick={() => { setShowOnboarding(true); trackEvent('help-open'); }}
                className="group bg-neutral-900 border border-neutral-800 p-4 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-neutral-400 transition-all shadow-xl relative overflow-hidden flex md:block items-center gap-4"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity hidden md:block">
                  <Info className="w-24 h-24" />
                </div>
                <div className="p-3 bg-neutral-800 rounded-xl md:bg-transparent md:p-0">
                  <Info className="w-5 h-5 md:w-8 md:h-8 text-neutral-400 md:mb-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-black uppercase italic text-white md:mb-2">Help Guide</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 font-bold uppercase tracking-widest leading-tight">
                    Manual & Onboarding Tips
                  </p>
                </div>
              </button>

            </div>
          </div>
        )}

        {/* SUB-VIEW: REGISTRY */}
        {activeTab === 'registry_view' && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 min-h-screen">
             {/* Header Section */}
             <div className="flex justify-between items-center gap-4 px-1 md:px-0">
               <button onClick={() => setActiveTab('more')} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest py-2">
                  <ChevronRight className="w-5 h-5 rotate-180" /> <span className="hidden md:inline">Back to System Menu</span><span className="md:hidden">Back</span>
               </button>
               
               <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 shadow-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] md:text-[10px] font-black text-neutral-500 uppercase tracking-widest">Progress</span>
                    <span className="text-lg md:text-xl font-black text-red-600 italic leading-none">{registryStats.percent}%</span>
                  </div>
                  <div className="w-16 md:w-24 h-1.5 md:h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                    <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${registryStats.percent}%` }} />
                  </div>
               </div>
             </div>

             <div className="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl relative">
                {/* Background Decor */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Ghost className="w-32 h-32 md:w-64 md:h-64" />
                   </div>
                </div>

                <div className="relative z-10">
                  {/* Sticky Controls */}
                  <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 p-4 md:p-6 space-y-4 rounded-t-3xl shadow-sm">
                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text" 
                            placeholder="Search specimens..." 
                            value={registrySearch}
                            onChange={(e) => setRegistrySearch(e.target.value)}
                            className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white focus:border-red-600 outline-none transition-colors shadow-inner"
                          />
                        </div>
                        <div className="relative">
                          <select 
                            value={registryFilter}
                            onChange={(e) => setRegistryFilter(e.target.value)}
                            className="w-full md:w-auto bg-neutral-800 border border-neutral-700 rounded-xl pl-4 pr-10 py-3 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-red-600 appearance-none shadow-sm"
                          >
                            <option value="All">All Arcanas</option>
                            {[...new Set(PERSONA_DATA.registry.map(p => p.arcana))].sort().map(arc => (
                              <option key={arc} value={arc}>{arc}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-2 justify-start">
                        <div className="flex items-center gap-1.5 opacity-80">
                          <span className="text-[8px] font-black uppercase text-yellow-500 tracking-tighter bg-yellow-900/20 px-1.5 py-0.5 rounded border border-yellow-900/50">Special</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-80">
                          <span className="text-[8px] font-black uppercase text-blue-500 tracking-tighter bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-900/50">DLC</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-80">
                          <span className="text-[8px] font-black uppercase text-purple-500 tracking-tighter bg-purple-900/20 px-1.5 py-0.5 rounded border border-purple-900/50">Rare</span>
                        </div>
                      </div>
                  </div>

                  {/* List */}
                  <div className="p-4 md:p-6 space-y-8 min-h-[50vh]">
                    {Object.entries(personasByArcana).map(([arc, personas]) => (
                      <div key={arc} className="space-y-3">
                        <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] flex items-center gap-2 border-b border-neutral-800 pb-2">
                          <Star className="w-3 h-3 fill-current" /> {arc}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {personas.map(p => {
                            const isChecked = checkedItems[`p_${p.name}`];
                            return (
                              <div 
                                key={p.name}
                                onClick={() => toggleItem(`p_${p.name}`)}
                                className={`flex items-center justify-between p-3 md:p-3 rounded-xl border transition-all cursor-pointer group active:scale-[0.98] ${
                                  isChecked 
                                    ? 'bg-neutral-950/50 border-neutral-800 opacity-40' 
                                    : 'bg-neutral-800/30 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800/50'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${isChecked ? 'bg-neutral-800 text-neutral-500' : 'bg-red-600 text-black'}`}>
                                    {p.level}
                                  </div>
                                  <div className="min-w-0">
                                    <div className={`text-sm font-black italic truncate ${isChecked ? 'text-neutral-500 line-through' : 'text-white'}`}>{p.name}</div>
                                    <div className="flex gap-2">
                                      {p.special && <span className="text-[8px] font-black uppercase text-yellow-500 tracking-tighter">Special</span>}
                                      {p.dlc && <span className="text-[8px] font-black uppercase text-blue-500 tracking-tighter">DLC</span>}
                                      {p.rare && <span className="text-[8px] font-black uppercase text-purple-500 tracking-tighter">Rare</span>}
                                    </div>
                                  </div>
                                </div>
                                {isChecked ? <CheckSquare className="w-5 h-5 text-green-500 shrink-0" /> : <Square className="w-5 h-5 text-neutral-700 group-hover:text-neutral-500 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {Object.keys(personasByArcana).length === 0 && (
                      <div className="text-center py-20">
                        <Ghost className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">No specimens found.</p>
                      </div>
                    )}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* SUB-VIEW: REFERENCE */}
        {activeTab === 'library_view' && (
          <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500">
            <button onClick={() => setActiveTab('more')} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-2 md:mb-4 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to System Menu
            </button>
            <div className="text-center max-w-2xl mx-auto mb-6 md:mb-12">
              <h2 className="text-2xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-2 md:mb-4">Reference Hub</h2>
              <p className="text-[10px] md:text-sm text-neutral-500 font-bold uppercase tracking-widest leading-relaxed px-4">
                Guides, tools and community resources.
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              {Array.isArray(RESOURCE_DATA) && RESOURCE_DATA.map((section) => {
                const SectionIcon = RESOURCE_ICONS[section.icon] || Info;
                return (
                  <div key={section.id} className="space-y-4 md:space-y-6">
                    {/* Section Header - Vertical Stack */}
                    <div className="flex items-center gap-3 border-b border-neutral-800 pb-3 md:pb-4 mx-2 md:mx-0">
                      <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl bg-neutral-900 border border-neutral-800 ${section.color}`}>
                        <SectionIcon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-2xl font-black uppercase text-white tracking-tight leading-none">{section.title}</h3>
                        <p className="text-[10px] md:text-sm text-neutral-500 font-semibold mt-1 tracking-wider">{section.description}</p>
                      </div>
                    </div>

                    {/* Items Grid - Horizontal layout within section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-2 md:px-0">
                      {section.items.map((item, idx) => {
                        const FormatIcon = FORMAT_ICONS[item.format] || Info;
                        let hostname = 'EXTERNAL';
                        try {
                           if (item.isLocked) {
                             hostname = 'COMING SOON';
                           } else if (item.url) {
                             hostname = new URL(item.url).hostname.replace('www.', '');
                           }
                        } catch (e) {
                           console.warn('Invalid URL:', item.url);
                        }
                        
                        return (
                          <a 
                            key={idx}
                            href={item.isLocked ? undefined : item.url}
                            target={item.isLocked ? undefined : "_blank"}
                            rel={item.isLocked ? undefined : "noopener noreferrer"}
                            onClick={() => !item.isLocked && trackEvent('resource-click', { title: item.title, category: 'library' })}
                            className={`group bg-neutral-900 border border-neutral-800 rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all flex flex-col justify-between ${
                              item.isLocked 
                                ? 'cursor-not-allowed border-neutral-800' 
                                : item.isGold 
                                  ? 'bg-red-600/5 border-red-600/30 hover:bg-red-600/10 hover:border-red-500' 
                                  : 'bg-neutral-800/30 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-600'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3 md:mb-4">
                              <div className="flex items-center gap-2">
                                  <FormatIcon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${item.isLocked ? 'text-neutral-600' : 'text-neutral-500 group-hover:text-red-500'} transition-colors`} />
                                  <span className="text-[10px] font-black tracking-widest text-neutral-600">{item.format}</span>
                                </div>
                                {item.isLocked ? (
                                  <div className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[9px] font-black uppercase text-neutral-600">Upcoming</div>
                                ) : (
                                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                )}
                              </div>
                              <h4 className={`text-sm md:text-lg font-black uppercase mb-1 md:mb-2 leading-tight transition-colors ${
                                item.isLocked ? 'text-white' : 'text-white group-hover:text-red-500'
                              }`}>
                                {item.title}
                              </h4>
                              <p className={`text-[11px] md:text-sm font-medium leading-relaxed ${
                                item.isLocked ? 'text-neutral-500' : 'text-neutral-400'
                              }`}>
                                {item.desc}
                              </p>
                            </div>
                            
                            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-neutral-800/50 flex items-center justify-between">
                              <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] text-neutral-600 group-hover:text-neutral-400 transition-colors flex items-center gap-2">
                                {hostname}
                              </span>
                              {item.isGold && !item.isLocked && <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500 fill-current" />}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <NextGameVote />
        <section className="mt-12 text-center space-y-4" aria-label="About P5 Tracker">
          <ShareTracker />
          <p className="text-sm text-neutral-400">
            <a className="underline" href={`${import.meta.env.BASE_URL}p3/`} onClick={() => trackEvent('guide_opened', { guide: 'persona-3-reload', location: 'footer' })}>Persona 3 Reload planner</a>
            {' · '}
            <a className="underline" href={import.meta.env.BASE_URL} onClick={() => trackEvent('guide_opened', { guide: 'games', location: 'footer' })}>All games</a>
            {' · '}
            <a className="underline" href={`${import.meta.env.BASE_URL}guides/school-answers/`} onClick={() => trackEvent('guide_opened', { guide: 'school-answers', location: 'footer' })}>School and exam answers</a>
            {' · '}
            <a className="underline" href={`${import.meta.env.BASE_URL}guides/third-semester/`} onClick={() => trackEvent('guide_opened', { guide: 'third-semester', location: 'footer' })}>Maruki deadline check</a>
            {' · '}
            <a className="underline" href={`${import.meta.env.BASE_URL}guides/monthly-checklist/`} onClick={() => trackEvent('guide_opened', { guide: 'monthly-checklist', location: 'footer' })}>Monthly planning guide</a>
            {' · '}
            <a className="underline" href={`${import.meta.env.BASE_URL}guides/confidant-tracker/`} onClick={() => trackEvent('guide_opened', { guide: 'confidant-tracker', location: 'footer' })}>Confidant tracking guide</a>
          </p>
          <p className="text-xs text-neutral-500">Unofficial fan tool. Not affiliated with ATLUS or SEGA. Progress is saved in this browser. Umami measures visits and feature use.</p>
        </section>
        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-neutral-800 text-center opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-[10px] tracking-[0.2em] text-neutral-500 mb-4 flex flex-wrap items-center justify-center gap-2">
            <span>v{APP_VERSION}</span>
            <span>•</span>
            <button onClick={() => { setChangelogFullHistory(true); setShowChangelog(true); trackEvent('changelog-open'); }} className="hover:text-white underline decoration-red-600 underline-offset-4 transition-colors font-bold tracking-widest uppercase">What's New</button>
            <span>•</span>
            <button onClick={() => setShowRoadmap(true)} className="hover:text-white underline decoration-blue-600 underline-offset-4 transition-colors font-bold tracking-widest uppercase">Roadmap</button>
            <span>•</span>
            <button onClick={() => { setShowOnboarding(true); trackEvent('help-open'); }} className="hover:text-white underline decoration-yellow-500 underline-offset-4 transition-colors font-bold tracking-widest uppercase">Help</button>
            <span>•</span>
            <a 
              href="https://github.com/zucram/P5Tracker#support--feedback" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => trackEvent('support-feedback-click')}
              className="hover:text-white underline decoration-neutral-600 underline-offset-4 transition-colors font-bold tracking-widest uppercase"
            >
              Support & Feedback
            </a>
          </p>
          <a 
            href="https://ko-fi.com/K3K11RWTSL" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackEvent('support-link-click', { location: 'footer' })}
            className="inline-flex items-center gap-2 bg-[#FF5E5B] hover:bg-[#FF5E5B]/90 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-lg"
          >
            <Heart className="w-3 h-3 fill-current" />
            Support on Ko-fi
          </a>
        </div>

      </main>

      {/* SAVE/LOAD MODAL */}
      <Modal label="Sync and backup" isOpen={saveModal} onClose={() => setSaveModal(false)} className="max-w-2xl border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)] rounded-[3rem]">
           <div className="p-10">
              <h2 className="text-4xl font-black text-red-600 italic uppercase mb-2 tracking-tighter">Sync Terminal</h2>
              <p className="text-neutral-400 text-sm mb-8 font-mono">{saveWarning ? 'Automatic saving is unavailable. Download your progress before closing this tab.' : 'Progress is saved in this browser.'} Download or copy a save to move it to another device. Importing replaces your progress and keeps one previous save here.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 <button onClick={exportFile} className="p-8 bg-red-600 hover:bg-white text-black font-black rounded-3xl transition-all flex flex-col items-center gap-3 shadow-xl group">
                    <Download className="w-10 h-10" />
                    <span className="text-xs tracking-widest font-bold">Download Save</span>
                 </button>
                 <div className="flex flex-col gap-3">
                    <button onClick={handleCopy} className="p-4 bg-neutral-800 hover:bg-neutral-700 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 text-xs tracking-widest font-bold">
                       {copied ? <ClipboardCheck className="text-green-500" /> : <Copy />}
                       {copied ? "Memory Synced!" : "Copy Data String"}
                    </button>
                    <textarea aria-label="Save data to import" maxLength={MAX_SAVE_BYTES} placeholder="Paste save data here..." value={importText} onChange={(e) => setImportText(e.target.value)} className="w-full h-32 bg-black border border-neutral-800 rounded-2xl p-4 font-mono text-[10px] text-red-500 outline-none focus:border-red-600 mb-6" />
                    <button onClick={() => applySave(importText)} disabled={!importText.trim()} className="w-full bg-white text-black p-4 rounded-2xl text-xs font-bold tracking-widest disabled:opacity-40">Import pasted save</button>
                    <label className="text-sm text-neutral-300">Or import a save file
                      <input type="file" accept=".txt,.json,application/json,text/plain" onChange={handleImportFile} className="mt-2 block w-full text-xs text-neutral-400 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-3 file:py-2 file:text-white" />
                    </label>
                 </div>
              </div>
              {loadedSave.original && <div className="mb-5 rounded-xl border border-amber-700 p-4 text-sm text-amber-100"><p>A recovery document with the original stored text is available. It is separate from a normal save import.</p><button onClick={exportOriginal} className="mt-3 rounded-lg border border-amber-500 px-3 py-3">Download original stored data</button></div>}
              {saveStatus && <p role="status" aria-live="polite" className="mb-5 text-sm text-neutral-200">{saveStatus}</p>}
              {hasPreviousSave && <button onClick={restorePreviousSave} className="mb-6 w-full rounded-2xl border border-neutral-700 p-3 text-sm text-neutral-300 hover:border-white">Restore previous save</button>}
              <input type="text" aria-hidden="true" tabIndex={-1} ref={hiddenInputRef} className="opacity-0 absolute pointer-events-none" />
              <button onClick={() => setSaveModal(false)} className="w-full text-neutral-600 hover:text-red-500 text-[10px] font-black tracking-[0.5em] transition-colors uppercase">Close Terminal</button>
           </div>
      </Modal>
      {/* CHANGELOG MODAL */}
      <Modal label="What's new" isOpen={showChangelog} onClose={() => setShowChangelog(false)} className="max-w-lg border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)] max-h-[80vh]">
           <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div className="flex justify-between items-start mb-8 border-b-2 border-red-600 pb-4">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mission Intel</h2>
                  <div className="text-neutral-500 font-bold font-mono text-xs mt-1 uppercase tracking-widest">Update History</div>
                </div>
                <button onClick={() => setShowChangelog(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-red-600 transition-colors"><ChevronDown className="w-6 h-6 rotate-180" /></button>
              </div>
              
              <div className="space-y-12">
                {RELEASE_NOTES
                  .filter(r => changelogFullHistory || isVersionNewer(r.version, lastSeenVersion.current))
                  .map((release, releaseIdx) => (
                  <div key={release.version} className={`relative ${releaseIdx !== 0 ? 'opacity-60 grayscale-[50%] hover:opacity-100 hover:grayscale-0 transition-all pt-8 border-t border-neutral-800' : ''}`}>
                    {releaseIdx === 0 && (
                      <div className="absolute -top-4 -left-2 bg-red-600 text-black text-[8px] font-black px-2 py-0.5 uppercase rotate-[-2deg] shadow-lg">New Deployment</div>
                    )}
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{release.title}</h3>
                      <span className="text-red-600 font-bold font-mono text-xs">v{release.version}</span>
                    </div>
                    
                    <p className="text-sm text-neutral-400 italic mb-6">"{release.description}"</p>
                    
                    <div className="space-y-6">
                      {release.sections.map((section, i) => (
                        <div key={i}>
                          <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-3 border-b border-red-900/30 pb-1">{section.title}</h4>
                          <ul className="space-y-2">
                            {section.items.map((item, j) => (
                              <li key={j} className="text-sm text-neutral-300 flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">›</span>
                                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') }} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowChangelog(false)} className="w-full mt-12 bg-white text-black p-4 rounded-xl text-xs font-bold tracking-widest hover:bg-red-600 hover:text-white transition-colors">
                Acknowledged
              </button>
           </div>
      </Modal>
      {/* ROADMAP MODAL */}
      <Modal label="Roadmap" isOpen={showRoadmap} onClose={() => setShowRoadmap(false)} className="max-w-lg border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.2)] max-h-[80vh]">
           <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar max-h-[80vh]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-blue-500">The Path Ahead</h2>
                  <div className="text-neutral-500 font-bold font-mono text-xs mt-1 uppercase tracking-widest">Feature Roadmap</div>
                </div>
                <button onClick={() => setShowRoadmap(false)} className="p-2 bg-neutral-800 rounded-full hover:bg-blue-600 transition-colors"><ChevronDown className="w-6 h-6 rotate-180" /></button>
              </div>
              
              <div className="space-y-8">
                {ROADMAP.map((section, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-3 border-b border-neutral-800 pb-1">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">{section.title}</h4>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${section.status === 'Active' ? 'bg-blue-600 text-white animate-pulse' : 'bg-neutral-800 text-neutral-500'}`}>
                        {section.status}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, j) => (
                        <li key={j} className="text-xs text-neutral-400 flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">›</span>
                          <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-200">$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowRoadmap(false)} className="w-full mt-8 bg-blue-600 text-white p-4 rounded-xl text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                Close Roadmap
              </button>
           </div>
      </Modal>

      {/* ONBOARDING MODAL */}
      <Modal label="How to use P5 Tracker" isOpen={showOnboarding} onClose={completeOnboarding} className="max-w-md border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.3)] max-h-[85vh]">
           <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-xl shadow-red-900/40">
                  <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">How to use P5 Tracker</h2>
                <p className="text-[10px] md:text-xs text-neutral-500 uppercase font-bold tracking-widest mt-1">Royal tracker help</p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <OnboardingItem icon={Calendar} color="text-blue-500" title="Choose your month" text="Open Calendar, select your in-game month, and use Set as Active to update the tracker." />
                <OnboardingItem icon={CheckSquare} color="text-red-500" title="Record completed tasks" text="Check tasks after you finish them in your game. The checklist records your progress; it does not complete in-game actions." />
                <OnboardingItem icon={Users} color="text-red-500" title="Track confidants" text="Open Confidants to update ranks, read dialogue answers and look up gifts. Browsing a guide does not change your rank." />
                <OnboardingItem icon={Zap} color="text-yellow-500" title="Update social stats" text="Set your social stats in Briefing to check confidant requirements." />
                <OnboardingItem icon={MapPin} color="text-red-500" title="Plan Palace visits" text="Open Metaverse for Palace deadlines, Will Seeds, boss help and Mementos requests." />
                <OnboardingItem icon={Save} color="text-white" title="Back up your progress" text="Use Sync to download a backup or import it on another device. Saves stay in this browser until you transfer them." />
              </div>

              <button 
                onClick={completeOnboarding}
                className="w-full mt-8 md:mt-10 py-3 md:py-4 rounded-2xl bg-red-600 text-black font-bold text-xs hover:bg-white transition-all shadow-lg shadow-red-900/20"
              >
                Understood
              </button>
           </div>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, label, icon: Icon }) {
  const isSpecial = label.includes('✨');
  return (
    <button onClick={onClick} aria-current={active ? 'page' : undefined} className={`flex-1 py-2 md:py-4 px-1 md:px-2 rounded-xl font-black uppercase italic text-[8px] md:text-xs tracking-tighter transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 ${
      active 
        ? (isSpecial ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-red-600 text-black shadow-lg shadow-red-900/40') 
        : (isSpecial ? 'text-blue-500 hover:text-blue-400' : 'text-neutral-500 hover:text-white')
    }`}>
      {Icon && <Icon className="w-4 h-4 md:w-4 md:h-4" />}
      <span className="scale-90 md:scale-100">{label.replace(' ✨', '')}</span>
      {isSpecial && <span className="md:hidden">✨</span>}
    </button>
  );
}

function OnboardingItem({ icon: Icon, color, title, text }) {
  return (
    <div className="flex gap-4 p-3 bg-neutral-800/30 rounded-2xl border border-neutral-800/50">
      <div className={`p-2 bg-neutral-900 rounded-xl h-fit border border-neutral-800 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-left">
        <div className="font-black text-white uppercase text-xs tracking-widest">{title}</div>
        <div className="text-sm text-neutral-300 leading-relaxed mt-1">{text}</div>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, children, label = "P5 Tracker dialog", className = "max-w-lg" }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const panel = panelRef.current;
    const focusable = () => [...panel.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter(element => element.getClientRects().length && element.tabIndex >= 0);
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); panel.focus(); return; }
      const first = elements[0];
      const last = elements.at(-1);
      if (!panel.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    (focusable()[0] || panel).focus();
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (document.contains(previousFocus)) previousFocus?.focus?.();
      else document.querySelector('main')?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 md:p-4 z-[100] animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
        aria-label="Close modal"
      />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={`relative bg-neutral-900 border-2 border-neutral-800 rounded-[2.5rem] md:rounded-[3rem] w-full ${className} shadow-2xl z-10 flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden`}>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
