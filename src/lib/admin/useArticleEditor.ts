'use client';

import { useReducer, useCallback } from 'react';
import { ArticleSection } from './analyzeSEO';

export type ArticleStatus = 'draft' | 'published' | 'archived' | 'scheduled';
export type ArticleCategory = 'Métiers' | 'Formation' | 'Alternance' | 'Vie étudiante';

export interface ArticleEditorState {
  id: string | null;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: ArticleCategory;
  focusKeyword: string;
  sections: ArticleSection[];
  readTime: string;
  status: ArticleStatus;
  source: string;
  scheduledAt: string;
}

const initialState: ArticleEditorState = {
  id: null,
  slug: '',
  title: '',
  metaTitle: '',
  metaDescription: '',
  excerpt: '',
  category: 'Métiers',
  focusKeyword: '',
  sections: [],
  readTime: '5 min',
  status: 'draft',
  source: 'manual',
  scheduledAt: '',
};

type Action =
  | { type: 'SET_FIELD'; field: keyof ArticleEditorState; value: unknown }
  | { type: 'ADD_BLOCK'; section: ArticleSection }
  | { type: 'UPDATE_BLOCK'; id: string; updates: Partial<ArticleSection> }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'MOVE_BLOCK'; id: string; direction: 'up' | 'down' }
  | { type: 'LOAD_ARTICLE'; article: Partial<ArticleEditorState> }
  | { type: 'RESET' };

function reducer(state: ArticleEditorState, action: Action): ArticleEditorState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'ADD_BLOCK':
      return { ...state, sections: [...state.sections, action.section] };

    case 'UPDATE_BLOCK':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.id ? { ...s, ...action.updates } : s
        ),
      };

    case 'DELETE_BLOCK':
      return {
        ...state,
        sections: state.sections.filter(s => s.id !== action.id),
      };

    case 'MOVE_BLOCK': {
      const idx = state.sections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      const newSections = [...state.sections];
      if (action.direction === 'up' && idx > 0) {
        [newSections[idx - 1], newSections[idx]] = [newSections[idx], newSections[idx - 1]];
      } else if (action.direction === 'down' && idx < newSections.length - 1) {
        [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
      }
      return { ...state, sections: newSections };
    }

    case 'LOAD_ARTICLE':
      return { ...initialState, ...action.article };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// Auto-generate slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Estimate read time from word count
export function estimateReadTime(sections: ArticleSection[]): string {
  let text = '';
  for (const s of sections) {
    if (s.content) text += ' ' + s.content.replace(/<[^>]+>/g, '');
    if (s.items) text += ' ' + s.items.join(' ');
    if (s.questions) {
      for (const q of s.questions) text += ' ' + q.question + ' ' + q.answer;
    }
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return `${Math.max(1, minutes)} min`;
}

// Generate unique block ID
export function genId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function useArticleEditor(initial?: Partial<ArticleEditorState>) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...initial,
  });

  const setField = useCallback(<K extends keyof ArticleEditorState>(field: K, value: ArticleEditorState[K]) => {
    dispatch({ type: 'SET_FIELD', field, value });
    // Auto-generate slug from title
    if (field === 'title') {
      dispatch({ type: 'SET_FIELD', field: 'slug', value: slugify(value as string) });
    }
  }, []);

  const addBlock = useCallback((type: ArticleSection['type']) => {
    const id = genId();
    let section: ArticleSection;
    switch (type) {
      case 'heading':
        section = { id, type: 'heading', level: 'h2', content: '' };
        break;
      case 'paragraph':
        section = { id, type: 'paragraph', content: '' };
        break;
      case 'callout':
        section = { id, type: 'callout', variant: 'info', content: '' };
        break;
      case 'list':
        section = { id, type: 'list', items: [''] };
        break;
      case 'faq':
        section = { id, type: 'faq', questions: [{ question: '', answer: '' }] };
        break;
      default:
        section = { id, type: 'paragraph', content: '' };
    }
    dispatch({ type: 'ADD_BLOCK', section });
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<ArticleSection>) => {
    dispatch({ type: 'UPDATE_BLOCK', id, updates });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', id });
  }, []);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    dispatch({ type: 'MOVE_BLOCK', id, direction });
  }, []);

  const loadArticle = useCallback((article: Partial<ArticleEditorState>) => {
    dispatch({ type: 'LOAD_ARTICLE', article });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    setField,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    loadArticle,
    reset,
  };
}
