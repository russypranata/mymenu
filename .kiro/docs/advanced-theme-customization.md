# Advanced Theme Customization Features

## Overview
Fitur kustomisasi tema lanjutan yang memungkinkan pemilik toko untuk mengontrol tampilan menu digital mereka dengan lebih detail dan profesional.

## New Features Implemented

### 1. **Dark Mode Toggle** 🌙
- **Field**: `dark_mode_enabled` (boolean)
- **Default**: `false`
- **Deskripsi**: Memungkinkan pelanggan untuk beralih antara tema terang dan gelap
- **Use Case**: Meningkatkan kenyamanan membaca di berbagai kondisi pencahayaan
- **Best Practice**: Simpan preferensi user di localStorage untuk konsistensi

### 2. **Accent Color** 🎨
- **Field**: `accent_color` (text)
- **Default**: `#10b981` (green-500)
- **Deskripsi**: Warna sekunder untuk tombol, badge, dan elemen aksen
- **Use Case**: Memberikan fleksibilitas branding dengan 2 warna utama
- **Best Practice**: Pastikan kontras yang baik dengan primary color

### 3. **Border Radius Options** 📐
- **Field**: `border_radius` (enum)
- **Options**:
  - `sharp`: 0px - Sudut tajam, modern & minimalis
  - `rounded`: 12px - Sudut melengkung, friendly & approachable
  - `pill`: 24px - Sangat melengkung, playful & modern
- **Default**: `rounded`
- **Use Case**: Menyesuaikan dengan brand identity (formal vs casual)

### 4. **Card Style Options** 🃏
- **Field**: `card_style` (enum)
- **Options**:
  - `minimal`: Tanpa border, flat design
  - `card`: Dengan border & shadow ringan (default)
  - `elevated`: Shadow tebal, menonjol & premium
- **Default**: `card`
- **Use Case**: Mengatur hierarki visual dan kesan premium

### 5. **Text Size Options** 📝
- **Field**: `text_size` (enum)
- **Options**:
  - `sm`: Teks kecil & compact (untuk menu panjang)
  - `md`: Ukuran standar (default)
  - `lg`: Teks besar & mudah dibaca (untuk target audience senior)
- **Default**: `md`
- **Use Case**: Accessibility & readability optimization

### 6. **Background Pattern** 🎭
- **Field**: `background_pattern` (enum)
- **Options**:
  - `none`: Tanpa pattern (default)
  - `dots`: Titik-titik halus (subtle & modern)
  - `grid`: Garis grid (technical & structured)
  - `waves`: Gelombang subtle (organic & flowing)
- **Default**: `none`
- **Use Case**: Menambah depth & texture tanpa mengganggu konten

## Database Schema

```sql
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS dark_mode_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#10b981',
ADD COLUMN IF NOT EXISTS border_radius text DEFAULT 'rounded' 
  CHECK (border_radius IN ('sharp', 'rounded', 'pill')),
ADD COLUMN IF NOT EXISTS card_style text DEFAULT 'card' 
  CHECK (card_style IN ('minimal', 'card', 'elevated')),
ADD COLUMN IF NOT EXISTS text_size text DEFAULT 'md' 
  CHECK (text_size IN ('sm', 'md', 'lg')),
ADD COLUMN IF NOT EXISTS background_pattern text DEFAULT 'none' 
  CHECK (background_pattern IN ('none', 'dots', 'grid', 'waves'));
```

## Implementation Details

### TypeScript Types
All new fields added to `store_settings` type in `src/types/database.types.ts`:
- Row, Insert, and Update interfaces updated
- Proper null handling for optional fields

### Server Actions
Updated `src/lib/actions/store.ts`:
- `UpdateStoreSettingsInput` interface extended
- `updateStoreSettings` function handles all new fields
- Proper validation and type safety

### UI Components
Enhanced `src/components/store-appearance-form.tsx`:
- Visual previews for each option
- Intuitive selection UI with descriptions
- Real-time preview capability
- Organized in logical sections

## UI/UX Best Practices Applied

### 1. **Visual Feedback**
- Active state clearly indicated with green accent
- Preview boxes show actual effect
- Hover states for better interactivity

### 2. **Progressive Disclosure**
- Advanced options don't overwhelm users
- Grouped by category (Colors, Layout, Typography, Effects)
- Clear labels and descriptions

### 3. **Sensible Defaults**
- All options have safe, professional defaults
- Works well out-of-the-box
- Easy to customize when needed

### 4. **Accessibility**
- Color contrast considerations
- Text size options for readability
- Dark mode for eye comfort
- Semantic HTML with proper ARIA labels

## Usage Example

```typescript
// In store appearance form
const [darkModeEnabled, setDarkModeEnabled] = useState(settings?.dark_mode_enabled ?? false)
const [accentColor, setAccentColor] = useState(settings?.accent_color ?? '#10b981')
const [borderRadius, setBorderRadius] = useState(settings?.border_radius ?? 'rounded')
const [cardStyle, setCardStyle] = useState(settings?.card_style ?? 'card')
const [textSize, setTextSize] = useState(settings?.text_size ?? 'md')
const [backgroundPattern, setBackgroundPattern] = useState(settings?.background_pattern ?? 'none')

// Save to database
await updateStoreSettings({
  storeId,
  darkModeEnabled,
  accentColor,
  borderRadius,
  cardStyle,
  textSize,
  backgroundPattern,
  // ... other settings
})
```

## Next Steps for Implementation

### Frontend (Public Menu Page)
1. **Apply border radius** to all cards and buttons based on setting
2. **Apply card style** with appropriate shadows and borders
3. **Apply text size** with CSS classes
4. **Apply background pattern** with CSS or SVG
5. **Implement dark mode toggle** with theme switcher component
6. **Use accent color** for secondary elements

### Example CSS Application
```tsx
// In public menu component
const radiusClass = {
  sharp: 'rounded-none',
  rounded: 'rounded-xl',
  pill: 'rounded-full'
}[borderRadius]

const cardClass = {
  minimal: '',
  card: 'border border-gray-200 shadow-sm',
  elevated: 'shadow-lg'
}[cardStyle]

const textClass = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}[textSize]
```

## Benefits

### For Store Owners
- ✅ Complete brand control
- ✅ Professional appearance
- ✅ Stand out from competitors
- ✅ No coding required

### For Customers
- ✅ Better readability
- ✅ Comfortable viewing experience
- ✅ Consistent brand experience
- ✅ Accessibility options

### For Platform
- ✅ Competitive advantage
- ✅ Higher customer satisfaction
- ✅ Premium feature for upselling
- ✅ Modern, professional image

## Migration Notes

Run the migration:
```bash
supabase migration up
```

Or apply manually:
```bash
psql -f supabase/migrations/023_advanced_theme_customization.sql
```

All existing stores will use default values, no data loss.

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] TypeScript types compile without errors
- [ ] Form saves all new settings correctly
- [ ] Settings persist after page reload
- [ ] Preview button shows changes
- [ ] All options have visual feedback
- [ ] Mobile responsive design works
- [ ] Accessibility standards met
- [ ] Performance not impacted

## Conclusion

Fitur kustomisasi tema lanjutan ini memberikan kontrol penuh kepada pemilik toko untuk menciptakan pengalaman menu digital yang unik dan profesional, sambil tetap mempertahankan kemudahan penggunaan dan best practices dalam desain UI/UX.
