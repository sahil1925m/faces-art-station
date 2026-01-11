import * as React from 'react';

// Centralized SVG icon library for facial features
// Each icon is a minimalist line drawing representing the feature

interface IconProps {
    className?: string;
}

// ============================================
// FACE SHAPE ICONS
// ============================================
export const FaceShapeIcons: Record<string, React.FC<IconProps>> = {
    'Oval': ({ className }) => (
        <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="28" rx="18" ry="24" />
        </svg>
    ),
    'Square': ({ className }) => (
        <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="6" y="6" width="36" height="42" rx="4" />
        </svg>
    ),
    'Round': ({ className }) => (
        <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="24" cy="28" r="20" />
        </svg>
    ),
    'Heart': ({ className }) => (
        <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M24 50 C8 36, 4 24, 8 14 C12 6, 18 4, 24 10 C30 4, 36 6, 40 14 C44 24, 40 36, 24 50Z" />
        </svg>
    ),
    'Long': ({ className }) => (
        <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="32" rx="14" ry="28" />
        </svg>
    ),
    'Diamond': ({ className }) => (
        <svg viewBox="0 0 48 56" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M24 4 L42 28 L24 52 L6 28 Z" />
        </svg>
    ),
};

// ============================================
// HAIRSTYLE ICONS
// ============================================
export const HairstyleIcons: Record<string, React.FC<IconProps>> = {
    'Bald': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="26" rx="16" ry="18" />
            <path d="M12 20 C16 8, 32 8, 36 20" strokeDasharray="2 2" opacity="0.5" />
        </svg>
    ),
    'Buzzcut': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="26" rx="16" ry="18" />
            <path d="M10 22 C14 10, 34 10, 38 22" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    'Short': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="28" rx="14" ry="16" />
            <path d="M8 24 C10 8, 38 8, 40 24" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'Wavy': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="30" rx="12" ry="14" />
            <path d="M6 26 C8 10, 18 6, 24 8 C30 6, 40 10, 42 26" />
            <path d="M6 26 C4 32, 6 38, 10 40" />
            <path d="M42 26 C44 32, 42 38, 38 40" />
        </svg>
    ),
    'Long': ({ className }) => (
        <svg viewBox="0 0 48 52" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="12" ry="14" />
            <path d="M6 20 C8 8, 40 8, 42 20" />
            <path d="M6 20 C4 28, 4 40, 8 48" />
            <path d="M42 20 C44 28, 44 40, 40 48" />
        </svg>
    ),
    'Curly': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="28" rx="12" ry="14" />
            <circle cx="12" cy="18" r="6" />
            <circle cx="24" cy="12" r="6" />
            <circle cx="36" cy="18" r="6" />
            <circle cx="8" cy="28" r="5" />
            <circle cx="40" cy="28" r="5" />
        </svg>
    ),
    'Afro': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="30" rx="10" ry="12" />
            <circle cx="24" cy="22" r="18" />
        </svg>
    ),
    'Ponytail': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="26" rx="12" ry="14" />
            <path d="M8 22 C10 10, 38 10, 40 22" />
            <path d="M36 18 C42 16, 46 20, 46 28 C46 36, 42 42, 38 44" strokeWidth="3" />
        </svg>
    ),
};

// ============================================
// FACIAL HAIR ICONS
// ============================================
export const FacialHairIcons: Record<string, React.FC<IconProps>> = {
    'Clean Shaven': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <line x1="18" y1="20" x2="22" y2="20" />
            <line x1="26" y1="20" x2="30" y2="20" />
            <path d="M20 30 Q24 34, 28 30" />
        </svg>
    ),
    'Stubble': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <g strokeWidth="1" opacity="0.5">
                <line x1="14" y1="34" x2="14" y2="36" />
                <line x1="18" y1="36" x2="18" y2="38" />
                <line x1="22" y1="35" x2="22" y2="37" />
                <line x1="26" y1="35" x2="26" y2="37" />
                <line x1="30" y1="36" x2="30" y2="38" />
                <line x1="34" y1="34" x2="34" y2="36" />
            </g>
        </svg>
    ),
    'Mustache': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M14 28 C18 26, 22 28, 24 28 C26 28, 30 26, 34 28" strokeWidth="3" />
        </svg>
    ),
    'Goatee': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M20 32 C22 38, 26 38, 28 32" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'Full Beard': ({ className }) => (
        <svg viewBox="0 0 48 52" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="22" rx="16" ry="16" />
            <path d="M10 26 C10 36, 16 46, 24 48 C32 46, 38 36, 38 26" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    'Soul Patch': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <ellipse cx="24" cy="36" rx="3" ry="4" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'Mutton Chops': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M8 22 C6 28, 8 36, 12 38" fill="currentColor" opacity="0.3" />
            <path d="M40 22 C42 28, 40 36, 36 38" fill="currentColor" opacity="0.3" />
        </svg>
    ),
};

// ============================================
// EYEBROW ICONS
// ============================================
export const EyebrowIcons: Record<string, React.FC<IconProps>> = {
    'Arched': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
            <path d="M4 18 Q12 6, 22 12" />
            <path d="M26 12 Q36 6, 44 18" />
        </svg>
    ),
    'Straight': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="28" y1="12" x2="44" y2="12" />
        </svg>
    ),
    'Rounded': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
            <path d="M4 16 Q12 10, 22 14" />
            <path d="M26 14 Q36 10, 44 16" />
        </svg>
    ),
    'Angled': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
            <path d="M4 16 L14 8 L22 12" />
            <path d="M26 12 L34 8 L44 16" />
        </svg>
    ),
    'Thick': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="4" className={className}>
            <path d="M4 14 Q12 8, 22 12" />
            <path d="M26 12 Q36 8, 44 14" />
        </svg>
    ),
    'Thin': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M4 14 Q12 8, 22 12" />
            <path d="M26 12 Q36 8, 44 14" />
        </svg>
    ),
};

// ============================================
// EYE ICONS
// ============================================
export const EyeIcons: Record<string, React.FC<IconProps>> = {
    'Almond': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 12 Q14 4, 24 12 Q14 20, 4 12" />
            <circle cx="14" cy="12" r="3" fill="currentColor" />
            <path d="M24 12 Q34 4, 44 12 Q34 20, 24 12" />
            <circle cx="34" cy="12" r="3" fill="currentColor" />
        </svg>
    ),
    'Round': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="12" cy="12" rx="8" ry="8" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <ellipse cx="36" cy="12" rx="8" ry="8" />
            <circle cx="36" cy="12" r="3" fill="currentColor" />
        </svg>
    ),
    'Hooded': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 14 Q12 8, 20 14 Q12 18, 4 14" />
            <path d="M4 12 L20 12" strokeDasharray="2 1" opacity="0.5" />
            <circle cx="12" cy="14" r="2" fill="currentColor" />
            <path d="M28 14 Q36 8, 44 14 Q36 18, 28 14" />
            <path d="M28 12 L44 12" strokeDasharray="2 1" opacity="0.5" />
            <circle cx="36" cy="14" r="2" fill="currentColor" />
        </svg>
    ),
    'Downturned': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 10 Q12 8, 20 14" />
            <path d="M4 10 Q12 16, 20 14" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M28 14 Q36 8, 44 10" />
            <path d="M28 14 Q36 16, 44 10" />
            <circle cx="36" cy="12" r="3" fill="currentColor" />
        </svg>
    ),
    'Upturned': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 14 Q12 8, 20 10" />
            <path d="M4 14 Q12 16, 20 10" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M28 10 Q36 8, 44 14" />
            <path d="M28 10 Q36 16, 44 14" />
            <circle cx="36" cy="12" r="3" fill="currentColor" />
        </svg>
    ),
    'Deep-set': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 16 Q12 12, 20 16 Q12 20, 4 16" />
            <circle cx="12" cy="16" r="2" fill="currentColor" />
            <path d="M28 16 Q36 12, 44 16 Q36 20, 28 16" />
            <circle cx="36" cy="16" r="2" fill="currentColor" />
            <line x1="2" y1="10" x2="22" y2="10" opacity="0.3" />
            <line x1="26" y1="10" x2="46" y2="10" opacity="0.3" />
        </svg>
    ),
};

// ============================================
// NOSE ICONS
// ============================================
export const NoseIcons: Record<string, React.FC<IconProps>> = {
    'Straight': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M16 4 L16 32" />
            <path d="M16 32 Q10 36, 8 34" />
            <path d="M16 32 Q22 36, 24 34" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M16 4 L16 28" />
            <path d="M16 28 Q6 36, 4 32" />
            <path d="M16 28 Q26 36, 28 32" />
        </svg>
    ),
    'Hooked': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M14 4 Q20 16, 18 24 Q16 32, 16 32" />
            <path d="M16 32 Q10 36, 8 34" />
            <path d="M16 32 Q22 36, 24 34" />
        </svg>
    ),
    'Button': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M16 12 L16 26" />
            <circle cx="16" cy="30" r="6" />
        </svg>
    ),
    'Aquiline': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M14 4 C18 12, 20 20, 16 32" />
            <path d="M16 32 Q10 36, 8 34" />
            <path d="M16 32 Q22 36, 24 34" />
        </svg>
    ),
    'Snub': ({ className }) => (
        <svg viewBox="0 0 32 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M16 8 Q18 16, 20 24 Q18 28, 16 28" />
            <path d="M16 28 Q10 32, 10 30" />
            <path d="M16 28 Q22 32, 22 30" />
        </svg>
    ),
};

// ============================================
// LIP ICONS
// ============================================
export const LipIcons: Record<string, React.FC<IconProps>> = {
    'Thin': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 12 Q24 8, 40 12" />
            <path d="M8 12 Q24 14, 40 12" />
        </svg>
    ),
    'Full': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 10 Q24 4, 40 10" />
            <path d="M8 10 Q24 12, 40 10" />
            <path d="M8 10 Q24 18, 40 10" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    'Bow-Shaped': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 10 Q16 6, 24 10 Q32 6, 40 10" />
            <path d="M8 10 Q24 18, 40 10" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 10 Q24 6, 44 10" />
            <path d="M4 10 Q24 16, 44 10" />
        </svg>
    ),
    'Heart': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M10 10 Q18 4, 24 10 Q30 4, 38 10" />
            <path d="M10 10 Q24 20, 38 10" />
        </svg>
    ),
};

// ============================================
// JAWLINE ICONS
// ============================================
export const JawlineIcons: Record<string, React.FC<IconProps>> = {
    'Sharp': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 8 L8 28 L24 44 L40 28 L40 8" />
        </svg>
    ),
    'Rounded': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 8 L8 24 Q8 40, 24 44 Q40 40, 40 24 L40 8" />
        </svg>
    ),
    'Square': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 8 L8 34 L16 40 L32 40 L40 34 L40 8" />
        </svg>
    ),
    'Pointed': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M10 8 L8 30 L24 46 L40 30 L38 8" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 8 L4 30 Q4 42, 24 44 Q44 42, 44 30 L44 8" />
        </svg>
    ),
};

// ============================================
// ACCESSORY ICONS
// ============================================
export const AccessoryIcons: Record<string, React.FC<IconProps>> = {
    'None': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="24" cy="24" r="16" strokeDasharray="4 4" opacity="0.3" />
            <line x1="12" y1="12" x2="36" y2="36" opacity="0.5" />
        </svg>
    ),
    'Eyeglasses': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="36" cy="12" r="8" />
            <path d="M20 12 L28 12" />
            <line x1="4" y1="10" x2="4" y2="12" />
            <line x1="44" y1="10" x2="44" y2="12" />
        </svg>
    ),
    'Sunglasses': ({ className }) => (
        <svg viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="28" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <path d="M20 12 L28 12" />
        </svg>
    ),
    'Baseball Cap': ({ className }) => (
        <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 20 Q8 8, 24 8 Q40 8, 40 20" />
            <path d="M8 20 L40 20" />
            <path d="M8 20 L2 24 L12 24" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    'Beanie': ({ className }) => (
        <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 24 Q8 8, 24 6 Q40 8, 40 24" />
            <line x1="8" y1="24" x2="40" y2="24" />
            <circle cx="24" cy="4" r="3" fill="currentColor" />
        </svg>
    ),
    'Earrings': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="20" rx="12" ry="14" />
            <circle cx="10" cy="24" r="4" fill="currentColor" opacity="0.4" />
            <circle cx="38" cy="24" r="4" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'Headband': ({ className }) => (
        <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M4 20 Q4 8, 24 6 Q44 8, 44 20" />
            <path d="M6 16 Q6 10, 24 8 Q42 10, 42 16" strokeWidth="4" opacity="0.4" />
        </svg>
    ),
};

// ============================================
// SKIN/AGE ICONS
// ============================================
export const SkinAgeIcons: Record<string, React.FC<IconProps>> = {
    'Smooth': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
        </svg>
    ),
    'Wrinkled': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M14 16 Q16 18, 14 20" strokeWidth="1" />
            <path d="M34 16 Q32 18, 34 20" strokeWidth="1" />
            <path d="M18 32 Q20 34, 22 32 Q24 34, 26 32 Q28 34, 30 32" strokeWidth="1" />
        </svg>
    ),
    'Scarred': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M28 14 L32 22" strokeWidth="2.5" />
            <path d="M29 18 L31 18" strokeWidth="1" />
        </svg>
    ),
    'Freckled': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <circle cx="16" cy="22" r="1" fill="currentColor" />
            <circle cx="20" cy="26" r="1" fill="currentColor" />
            <circle cx="24" cy="24" r="1" fill="currentColor" />
            <circle cx="28" cy="26" r="1" fill="currentColor" />
            <circle cx="32" cy="22" r="1" fill="currentColor" />
        </svg>
    ),
    'Aged': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M12 20 L16 20" strokeWidth="1" />
            <path d="M32 20 L36 20" strokeWidth="1" />
            <path d="M14 36 Q18 38, 22 36" strokeWidth="1" />
            <path d="M26 36 Q30 38, 34 36" strokeWidth="1" />
        </svg>
    ),
};

// ============================================
// EAR ICONS
// ============================================
export const EarIcons: Record<string, React.FC<IconProps>> = {
    'Small': ({ className }) => (
        <svg viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 6 Q20 8, 20 16 Q20 24, 12 26 Q8 24, 8 16 Q8 8, 12 6" />
        </svg>
    ),
    'Large': ({ className }) => (
        <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 2 Q24 6, 24 20 Q24 34, 12 38 Q4 34, 4 20 Q4 6, 12 2" />
        </svg>
    ),
    'Protruding': ({ className }) => (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M8 8 Q24 6, 28 16 Q24 26, 8 24 Q4 20, 6 16 Q4 12, 8 8" />
        </svg>
    ),
    'Attached Lobes': ({ className }) => (
        <svg viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 4 Q20 6, 20 14 Q20 22, 16 26 L8 26 Q6 22, 6 14 Q6 6, 12 4" />
        </svg>
    ),
    'Detached Lobes': ({ className }) => (
        <svg viewBox="0 0 24 36" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M12 4 Q20 6, 20 14 Q20 22, 14 24" />
            <path d="M14 24 Q16 28, 14 32" />
            <path d="M12 4 Q4 6, 4 14 Q4 22, 10 24" />
        </svg>
    ),
};

// ============================================
// CHEEKBONE ICONS
// ============================================
export const CheekboneIcons: Record<string, React.FC<IconProps>> = {
    'High': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M10 18 Q14 16, 18 20" fill="currentColor" opacity="0.2" />
            <path d="M38 18 Q34 16, 30 20" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    'Low': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <path d="M10 26 Q14 24, 18 28" fill="currentColor" opacity="0.2" />
            <path d="M38 26 Q34 24, 30 28" fill="currentColor" opacity="0.2" />
        </svg>
    ),
    'Prominent': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <ellipse cx="14" cy="22" rx="4" ry="3" fill="currentColor" opacity="0.3" />
            <ellipse cx="34" cy="22" rx="4" ry="3" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    'Flat': ({ className }) => (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <ellipse cx="24" cy="24" rx="16" ry="18" />
            <line x1="10" y1="24" x2="18" y2="24" opacity="0.3" />
            <line x1="30" y1="24" x2="38" y2="24" opacity="0.3" />
        </svg>
    ),
};

// ============================================
// ICON LOOKUP FUNCTION
// ============================================
export function getFeatureIcon(categoryId: string, featureLabel: string): React.FC<IconProps> | null {
    const iconMaps: Record<string, Record<string, React.FC<IconProps>>> = {
        'faceShape': FaceShapeIcons,
        'hairStyle': HairstyleIcons,
        'facialHair': FacialHairIcons,
        'eyebrows': EyebrowIcons,
        'eyes': EyeIcons,
        'nose': NoseIcons,
        'lips': LipIcons,
        'jawline': JawlineIcons,
        'accessories': AccessoryIcons,
        'skinAge': SkinAgeIcons,
        'ears': EarIcons,
        'cheekbones': CheekboneIcons,
    };

    const categoryIcons = iconMaps[categoryId];
    if (!categoryIcons) return null;

    return categoryIcons[featureLabel] || null;
}
