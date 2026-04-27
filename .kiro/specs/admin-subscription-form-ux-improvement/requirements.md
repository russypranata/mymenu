# Requirements Document

## Introduction

This feature improves the UX of the admin subscription edit form by adding contextual helper text to clarify the difference between manual date editing and automatic subscription extension. The current form has two sections (Manual Edit and Perpanjang Langganan) but lacks explanatory text, causing confusion about when to use each section. This improvement follows industry best practices from platforms like Stripe and AWS admin panels by providing clear, contextual guidance without changing existing functionality.

## Glossary

- **Admin_Panel**: The administrative interface for managing user subscriptions
- **Edit_Subscription_Modal**: The modal dialog containing subscription editing controls
- **Manual_Edit_Section**: The form section allowing direct status and expiry date modification
- **Extend_Section**: The form section providing quick extension buttons (1 month, 1 year, custom)
- **Helper_Text**: Explanatory text displayed to guide admin users
- **Current_Expiry_Date**: The existing expires_at value from the subscription record
- **Base_Date**: The date from which extension calculations start (current expiry if future, today if expired)

## Requirements

### Requirement 1: Display Helper Text in Manual Edit Section

**User Story:** As an admin, I want to see explanatory text in the manual edit section, so that I understand when to use manual date input versus extension buttons.

#### Acceptance Criteria

1. THE Manual_Edit_Section SHALL display helper text "Untuk koreksi data atau set tanggal spesifik" below the section title
2. THE helper text SHALL use text-xs font size and gray-400 color to match existing design patterns
3. THE helper text SHALL be visible immediately when the Edit_Subscription_Modal opens
4. THE helper text SHALL remain visible while the modal is open

### Requirement 2: Display Current Expiry Date Reference

**User Story:** As an admin, I want to see the current expiry date in the manual edit section, so that I have context when setting a new date.

#### Acceptance Criteria

1. WHEN the Edit_Subscription_Modal opens, THE Manual_Edit_Section SHALL display the Current_Expiry_Date
2. THE Current_Expiry_Date SHALL be formatted as "DD MMMM YYYY" using Indonesian locale
3. THE Current_Expiry_Date display SHALL include label text "Berakhir saat ini:"
4. THE Current_Expiry_Date display SHALL use text-xs font size and gray-500 color
5. IF the subscription has no expires_at value, THEN THE Manual_Edit_Section SHALL display "Belum ada tanggal berakhir"

### Requirement 3: Display Dynamic Helper Text in Extend Section

**User Story:** As an admin, I want to see the base date for extension calculations, so that I understand how the extension will be applied.

#### Acceptance Criteria

1. WHEN the subscription is active (expires_at is in the future), THE Extend_Section SHALL display helper text "Otomatis extend dari tanggal berakhir saat ini: [formatted date]"
2. WHEN the subscription is expired (expires_at is in the past or today), THE Extend_Section SHALL display helper text "Langganan sudah expired, akan extend dari hari ini"
3. THE formatted date SHALL use "DD MMMM YYYY" format with Indonesian locale
4. THE helper text SHALL use text-xs font size and gray-400 color
5. THE helper text SHALL be positioned below the "Perpanjang Langganan" section title

### Requirement 4: Maintain Existing Functionality

**User Story:** As an admin, I want all existing subscription editing features to work unchanged, so that my workflow is not disrupted.

#### Acceptance Criteria

1. THE Manual_Edit_Section SHALL continue to allow status dropdown selection
2. THE Manual_Edit_Section SHALL continue to allow direct expiry date input via date picker
3. THE Extend_Section SHALL continue to provide "Perpanjang 1 Bulan" button (30 days)
4. THE Extend_Section SHALL continue to provide "Perpanjang 1 Tahun" button (365 days)
5. THE Extend_Section SHALL continue to provide custom days input with plan type selection
6. THE extension calculation logic SHALL remain unchanged (extend from Current_Expiry_Date if future, today if expired)
7. THE "Simpan Perubahan" button SHALL continue to update status and expires_at
8. THE "Perpanjang" buttons SHALL continue to call extendSubscription action

### Requirement 5: Follow Existing Design System

**User Story:** As an admin, I want the new helper text to match the existing visual design, so that the interface feels cohesive.

#### Acceptance Criteria

1. THE helper text SHALL use Tailwind CSS classes consistent with existing components
2. THE helper text SHALL use the same color palette (gray-400, gray-500) as existing text elements
3. THE helper text SHALL use the same font sizing (text-xs) as existing secondary text
4. THE helper text SHALL maintain existing spacing patterns (space-y-3, space-y-4)
5. THE helper text SHALL not introduce new custom CSS classes

### Requirement 6: Handle Edge Cases for Date Display

**User Story:** As an admin, I want the helper text to handle all subscription states correctly, so that I always see accurate information.

#### Acceptance Criteria

1. WHEN the subscription has null expires_at, THE Current_Expiry_Date display SHALL show "Belum ada tanggal berakhir"
2. WHEN the subscription expires_at is exactly today, THE Extend_Section SHALL treat it as expired
3. WHEN the subscription expires_at is in the past, THE Extend_Section SHALL show "akan extend dari hari ini"
4. WHEN the subscription expires_at is in the future, THE Extend_Section SHALL show the formatted future date
5. THE date comparison logic SHALL use Date.getTime() for accurate comparison
