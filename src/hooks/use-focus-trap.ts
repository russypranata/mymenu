'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Traps keyboard focus inside the referenced container while active.
 * Implements WCAG 2.1 SC 2.1.2 (No Keyboard Trap) — focus cycles within
 * the dialog and returns to the trigger element on close.
 *
 * @param active  Whether the trap is currently active
 * @returns ref   Attach to the container element
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T>(null)
  // Remember which element had focus before the trap activated
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    // Save current focus so we can restore it on close
    previousFocusRef.current = document.activeElement as HTMLElement

    const container = containerRef.current
    if (!container) return

    // Move focus into the container on the first focusable element
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(el => !el.closest('[aria-hidden="true"]'))

    if (focusables.length > 0) {
      // Small delay to let the element render/animate before focusing
      const timer = setTimeout(() => focusables[0].focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [active])

  useEffect(() => {
    if (!active) {
      // Restore focus to the element that opened the dialog
      previousFocusRef.current?.focus()
      return
    }

    const container = containerRef.current
    if (!container) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      ).filter(el => !el.closest('[aria-hidden="true"]'))

      if (focusables.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusables[0]
      const last  = focusables[focusables.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [active])

  return containerRef
}
