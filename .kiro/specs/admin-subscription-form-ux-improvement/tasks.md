# Implementation Plan: Admin Subscription Form UX Improvement

## Overview

This implementation adds contextual helper text to the admin subscription edit modal to clarify the difference between manual date editing and automatic subscription extension. The changes are purely presentational and do not modify any existing business logic or server actions.

## Tasks

- [ ] 1. Add helper functions to SubActions component
  - Add `formatDateLong` function to format dates as "DD MMMM YYYY" in Indonesian locale
  - Add `isExpired` function to check if subscription is expired using Date.getTime() comparison
  - Both functions should be pure and handle null/undefined inputs gracefully
  - _Requirements: 2.2, 2.5, 6.5_

- [ ] 2. Update SubActions component interface and props
  - Add `currentExpiresAt?: string | null` to SubActionsProps interface
  - Update component to receive and use the new prop
  - _Requirements: 2.1_

- [ ] 3. Add helper text and current expiry display to Manual Edit section
  - Add helper text "Untuk koreksi data atau set tanggal spesifik" below section title
  - Add current expiry display "Berakhir saat ini: [formatted date]" using formatDateLong
  - Use text-xs, gray-400, and gray-500 colors to match existing design
  - Handle null expires_at case with "Belum ada tanggal berakhir" message
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 6.1_

- [ ] 4. Add dynamic helper text to Extend section
  - Add conditional helper text below "Perpanjang Langganan" section title
  - Show "Langganan sudah expired, akan extend dari hari ini" when isExpired returns true
  - Show "Otomatis extend dari tanggal berakhir saat ini: [formatted date]" when isExpired returns false
  - Use text-xs and gray-400 color to match existing design
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.2, 5.3, 6.2, 6.3, 6.4_

- [ ] 5. Update parent component to pass currentExpiresAt prop
  - Modify `src/app/(admin)/admin/subscriptions/page.tsx` to pass `currentExpiresAt={sub.expires_at}` to SubActions
  - Update both desktop table and mobile card list sections
  - _Requirements: 2.1_

- [ ] 6. Checkpoint - Verify all existing functionality works
  - Ensure all tests pass, ask the user if questions arise.
  - Verify status dropdown still works
  - Verify date picker still works
  - Verify "Simpan Perubahan" button still calls updateSubscription
  - Verify "Perpanjang 1 Bulan" and "Perpanjang 1 Tahun" buttons still work
  - Verify custom extend form still works
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [ ]* 7. Write unit tests for helper functions
  - Test formatDateLong with valid ISO date string returns "DD MMMM YYYY" format
  - Test formatDateLong with null returns "Belum ada tanggal berakhir"
  - Test isExpired with past date returns true
  - Test isExpired with future date returns false
  - Test isExpired with today's date returns true
  - Test isExpired with null returns true
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 8. Write unit tests for conditional rendering
  - Test Manual Edit section displays helper text
  - Test Manual Edit section displays current expiry with formatted date
  - Test Manual Edit section displays "Belum ada tanggal berakhir" when expires_at is null
  - Test Extend section displays "akan extend dari hari ini" for expired subscription
  - Test Extend section displays "Otomatis extend dari..." for active subscription
  - _Requirements: 1.1, 1.3, 2.1, 2.5, 3.1, 3.2_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- This feature is purely presentational - no database changes or API modifications
- All existing functionality must remain unchanged
- Helper text follows existing design patterns (Tailwind classes, color palette, spacing)
