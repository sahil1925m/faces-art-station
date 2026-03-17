import * as React from 'react';

// Redesigned SVG icon library for facial features
// Rules: 64x64 viewBox, contextual face silhouettes, stroke weight communication,
// one unique detail per icon, consistent scale with 8px padding

interface IconProps {
    className?: string;
}

// Reusable ghost face silhouette (very faint, provides anatomical context)
const GhostFace = ({ scale = 1, cy = 30 }: { scale?: number; cy?: number }) => (
    <ellipse cx="32" cy={cy} rx={16 * scale} ry={20 * scale} stroke="currentColor" strokeWidth="1" opacity="0.08" fill="none" />
);

// Reusable ghost head (for hair icons — just the cranium outline)
const GhostHead = () => (
    <ellipse cx="32" cy="34" rx="14" ry="17" stroke="currentColor" strokeWidth="1" opacity="0.08" fill="none" />
);

// ============================================
// FACE SHAPE ICONS
// ============================================
export const FaceShapeIcons: Record<string, React.FC<IconProps>> = {
    'Oval': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="22" />
            {/* Biometric tick marks */}
            <line x1="14" y1="32" x2="16" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="48" y1="32" x2="50" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="32" y1="9" x2="32" y2="11" opacity="0.3" strokeWidth="1" />
            <line x1="32" y1="53" x2="32" y2="55" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
    'Square': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <rect x="14" y="10" width="36" height="44" rx="4" />
            <line x1="12" y1="32" x2="14" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="50" y1="32" x2="52" y2="32" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
    'Round': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="32" cy="32" r="20" />
            <line x1="10" y1="32" x2="12" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="52" y1="32" x2="54" y2="32" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
    'Heart': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M32 56 C14 42, 10 28, 14 18 C18 10, 24 9, 32 16 C40 9, 46 10, 50 18 C54 28, 50 42, 32 56Z" />
            <line x1="32" y1="8" x2="32" y2="10" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
    'Long': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="13" ry="26" />
            <line x1="17" y1="32" x2="19" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="45" y1="32" x2="47" y2="32" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
    'Diamond': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M32 8 Q50 22, 50 32 Q50 42, 32 56 Q14 42, 14 32 Q14 22, 32 8Z" />
            <line x1="12" y1="32" x2="14" y2="32" opacity="0.3" strokeWidth="1" />
            <line x1="50" y1="32" x2="52" y2="32" opacity="0.3" strokeWidth="1" />
        </svg>
    ),
};

// ============================================
// HAIRSTYLE ICONS (on faint head silhouette)
// ============================================
export const HairstyleIcons: Record<string, React.FC<IconProps>> = {
    'Bald': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="34" rx="14" ry="17" />
            {/* Subtle shine line on bare scalp */}
            <path d="M26 20 Q32 16, 38 20" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
        </svg>
    ),
    'Buzzcut': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Very short hair cap - filled area */}
            <path d="M18 30 Q18 14, 32 13 Q46 14, 46 30" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
            {/* Buzz texture dots */}
            <circle cx="26" cy="20" r="0.8" fill="currentColor" opacity="0.3" />
            <circle cx="32" cy="17" r="0.8" fill="currentColor" opacity="0.3" />
            <circle cx="38" cy="20" r="0.8" fill="currentColor" opacity="0.3" />
            <circle cx="29" cy="24" r="0.8" fill="currentColor" opacity="0.3" />
            <circle cx="35" cy="24" r="0.8" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    'Short': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Short hair with volume */}
            <path d="M16 30 Q16 10, 32 9 Q48 10, 48 30" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            {/* Hair direction strokes */}
            <path d="M24 16 Q28 13, 32 14" strokeWidth="1" opacity="0.4" fill="none" />
            <path d="M32 14 Q36 13, 40 16" strokeWidth="1" opacity="0.4" fill="none" />
        </svg>
    ),
    'Wavy': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Wavy hair flowing down sides */}
            <path d="M14 32 Q14 12, 32 10 Q50 12, 50 32" strokeWidth="1.5" />
            <path d="M14 32 Q12 38, 14 44 Q16 48, 18 50" strokeWidth="1.5" />
            <path d="M50 32 Q52 38, 50 44 Q48 48, 46 50" strokeWidth="1.5" />
            {/* Wave texture */}
            <path d="M18 36 Q20 33, 22 36" strokeWidth="1" opacity="0.4" fill="none" />
            <path d="M42 36 Q44 33, 46 36" strokeWidth="1" opacity="0.4" fill="none" />
        </svg>
    ),
    'Long': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Long straight hair */}
            <path d="M14 28 Q14 10, 32 8 Q50 10, 50 28" strokeWidth="1.5" />
            <path d="M14 28 L12 56" strokeWidth="1.5" />
            <path d="M50 28 L52 56" strokeWidth="1.5" />
            {/* Straight hair direction lines */}
            <line x1="18" y1="30" x2="16" y2="52" strokeWidth="1" opacity="0.25" />
            <line x1="46" y1="30" x2="48" y2="52" strokeWidth="1" opacity="0.25" />
        </svg>
    ),
    'Curly': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Curly hair - cluster of small arcs */}
            <path d="M16 28 Q16 12, 32 10 Q48 12, 48 28" strokeWidth="1.5" />
            <path d="M16 28 Q12 32, 14 36 Q12 40, 16 44" strokeWidth="1.5" />
            <path d="M48 28 Q52 32, 50 36 Q52 40, 48 44" strokeWidth="1.5" />
            {/* Curl texture */}
            <circle cx="18" cy="22" r="4" strokeWidth="1" opacity="0.35" fill="none" />
            <circle cx="32" cy="14" r="4" strokeWidth="1" opacity="0.35" fill="none" />
            <circle cx="46" cy="22" r="4" strokeWidth="1" opacity="0.35" fill="none" />
        </svg>
    ),
    'Afro': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Large afro volume */}
            <circle cx="32" cy="26" r="22" strokeWidth="1.5" />
            {/* Texture lines */}
            <path d="M20 18 Q22 16, 24 18" strokeWidth="1" opacity="0.3" fill="none" />
            <path d="M36 14 Q38 12, 40 14" strokeWidth="1" opacity="0.3" fill="none" />
            <path d="M26 12 Q28 10, 30 12" strokeWidth="1" opacity="0.3" fill="none" />
        </svg>
    ),
    'Ponytail': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostHead />
            {/* Hair pulled back */}
            <path d="M18 28 Q18 12, 32 11 Q46 12, 46 28" strokeWidth="1.5" />
            {/* Ponytail flowing right */}
            <path d="M44 22 Q52 20, 54 28 Q54 40, 48 50" strokeWidth="2.5" />
            {/* Hair tie */}
            <circle cx="46" cy="22" r="2" fill="currentColor" opacity="0.4" />
        </svg>
    ),
};

// ============================================
// FACIAL HAIR ICONS
// ============================================
export const FacialHairIcons: Record<string, React.FC<IconProps>> = {
    'Clean Shaven': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Simple eyes */}
            <line x1="24" y1="28" x2="28" y2="28" strokeWidth="1.5" />
            <line x1="36" y1="28" x2="40" y2="28" strokeWidth="1.5" />
            {/* Smile */}
            <path d="M26 38 Q32 42, 38 38" strokeWidth="1.5" fill="none" />
        </svg>
    ),
    'Stubble': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Stubble dot pattern across jaw area */}
            <g fill="currentColor" opacity="0.5">
                <circle cx="20" cy="40" r="0.7" /><circle cx="24" cy="42" r="0.7" />
                <circle cx="28" cy="43" r="0.7" /><circle cx="32" cy="44" r="0.7" />
                <circle cx="36" cy="43" r="0.7" /><circle cx="40" cy="42" r="0.7" />
                <circle cx="44" cy="40" r="0.7" /><circle cx="22" cy="44" r="0.7" />
                <circle cx="26" cy="46" r="0.7" /><circle cx="30" cy="46" r="0.7" />
                <circle cx="34" cy="46" r="0.7" /><circle cx="38" cy="46" r="0.7" />
                <circle cx="42" cy="44" r="0.7" />
            </g>
        </svg>
    ),
    'Mustache': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Prominent mustache */}
            <path d="M20 36 Q24 33, 28 35 Q30 36, 32 36 Q34 36, 36 35 Q40 33, 44 36" strokeWidth="3" fill="none" />
            <path d="M22 36 Q27 39, 32 37 Q37 39, 42 36" strokeWidth="2" opacity="0.3" fill="none" />
        </svg>
    ),
    'Goatee': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Goatee shape on chin */}
            <path d="M26 38 Q28 36, 32 36 Q36 36, 38 38 Q38 46, 32 50 Q26 46, 26 38Z" fill="currentColor" opacity="0.25" strokeWidth="1.5" />
            {/* Texture hatches */}
            <line x1="30" y1="40" x2="30" y2="46" strokeWidth="0.8" opacity="0.3" />
            <line x1="34" y1="40" x2="34" y2="46" strokeWidth="0.8" opacity="0.3" />
        </svg>
    ),
    'Full Beard': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Full beard covering jaw */}
            <path d="M16 32 Q16 42, 20 48 Q26 56, 32 56 Q38 56, 44 48 Q48 42, 48 32" fill="currentColor" opacity="0.2" strokeWidth="1.5" />
            {/* Beard texture - short hatches */}
            <line x1="24" y1="40" x2="24" y2="46" strokeWidth="0.8" opacity="0.3" />
            <line x1="28" y1="42" x2="28" y2="50" strokeWidth="0.8" opacity="0.3" />
            <line x1="32" y1="42" x2="32" y2="52" strokeWidth="0.8" opacity="0.3" />
            <line x1="36" y1="42" x2="36" y2="50" strokeWidth="0.8" opacity="0.3" />
            <line x1="40" y1="40" x2="40" y2="46" strokeWidth="0.8" opacity="0.3" />
        </svg>
    ),
    'Soul Patch': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Small soul patch below lower lip */}
            <path d="M30 40 Q32 39, 34 40 Q34 44, 32 46 Q30 44, 30 40Z" fill="currentColor" opacity="0.4" strokeWidth="1" />
            {/* Lips hint for context */}
            <path d="M26 36 Q32 34, 38 36" strokeWidth="1" opacity="0.15" fill="none" />
        </svg>
    ),
    'Mutton Chops': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Left mutton chop */}
            <path d="M16 24 Q14 30, 14 36 Q14 44, 20 46 Q22 44, 20 36 Q18 28, 18 24Z" fill="currentColor" opacity="0.25" strokeWidth="1.5" />
            {/* Right mutton chop */}
            <path d="M48 24 Q50 30, 50 36 Q50 44, 44 46 Q42 44, 44 36 Q46 28, 46 24Z" fill="currentColor" opacity="0.25" strokeWidth="1.5" />
            {/* Texture */}
            <line x1="17" y1="30" x2="17" y2="40" strokeWidth="0.7" opacity="0.3" />
            <line x1="47" y1="30" x2="47" y2="40" strokeWidth="0.7" opacity="0.3" />
        </svg>
    ),
};

// ============================================
// EYEBROW ICONS
// ============================================
export const EyebrowIcons: Record<string, React.FC<IconProps>> = {
    'Arched': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            <path d="M16 26 Q22 16, 30 22" strokeWidth="2" />
            <path d="M34 22 Q42 16, 48 26" strokeWidth="2" />
        </svg>
    ),
    'Straight': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            <line x1="16" y1="24" x2="30" y2="24" strokeWidth="2" />
            <line x1="34" y1="24" x2="48" y2="24" strokeWidth="2" />
        </svg>
    ),
    'Rounded': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            <path d="M16 26 Q22 20, 30 24" strokeWidth="2" />
            <path d="M34 24 Q42 20, 48 26" strokeWidth="2" />
        </svg>
    ),
    'Angled': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            {/* Sharper angle than before */}
            <path d="M16 28 L24 18 L30 22" strokeWidth="2" strokeLinejoin="round" />
            <path d="M34 22 L40 18 L48 28" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    ),
    'Thick': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            <path d="M16 24 Q22 18, 30 22" strokeWidth="3" />
            <path d="M34 22 Q42 18, 48 24" strokeWidth="3" />
        </svg>
    ),
    'Thin': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" className={className}>
            <GhostFace />
            <path d="M16 24 Q22 20, 30 23" strokeWidth="1" />
            <path d="M34 23 Q42 20, 48 24" strokeWidth="1" />
        </svg>
    ),
};

// ============================================
// EYE ICONS
// ============================================
export const EyeIcons: Record<string, React.FC<IconProps>> = {
    'Almond': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left almond eye — pointed ends, moderate opening */}
            <path d="M16 30 Q22 24, 28 30" strokeWidth="1.5" />{/* upper lid */}
            <path d="M16 30 Q22 35, 28 30" strokeWidth="1.5" />{/* lower lid */}
            <circle cx="22" cy="30" r="2" fill="currentColor" />{/* pupil */}
            {/* Right almond eye */}
            <path d="M36 30 Q42 24, 48 30" strokeWidth="1.5" />
            <path d="M36 30 Q42 35, 48 30" strokeWidth="1.5" />
            <circle cx="42" cy="30" r="2" fill="currentColor" />
        </svg>
    ),
    'Round': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left round eye — wider opening, rounder curves */}
            <path d="M16 30 Q22 22, 28 30" strokeWidth="1.5" />
            <path d="M16 30 Q22 38, 28 30" strokeWidth="1.5" />
            <circle cx="22" cy="30" r="2.5" fill="currentColor" />
            {/* Right round eye */}
            <path d="M36 30 Q42 22, 48 30" strokeWidth="1.5" />
            <path d="M36 30 Q42 38, 48 30" strokeWidth="1.5" />
            <circle cx="42" cy="30" r="2.5" fill="currentColor" />
        </svg>
    ),
    'Hooded': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left hooded eye — heavy upper lid folds down over crease */}
            <path d="M16 32 Q22 28, 28 32" strokeWidth="1.5" />{/* visible lid line */}
            <path d="M16 32 Q22 36, 28 32" strokeWidth="1.5" />{/* lower */}
            <path d="M16 28 Q22 24, 28 28" strokeWidth="1" opacity="0.35" />{/* hood fold */}
            <circle cx="22" cy="32" r="1.8" fill="currentColor" />
            {/* Right hooded eye */}
            <path d="M36 32 Q42 28, 48 32" strokeWidth="1.5" />
            <path d="M36 32 Q42 36, 48 32" strokeWidth="1.5" />
            <path d="M36 28 Q42 24, 48 28" strokeWidth="1" opacity="0.35" />
            <circle cx="42" cy="32" r="1.8" fill="currentColor" />
        </svg>
    ),
    'Downturned': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left downturned eye — outer corner drops */}
            <path d="M16 28 Q22 26, 28 32" strokeWidth="1.5" />
            <path d="M16 30 Q22 34, 28 32" strokeWidth="1.5" />
            <circle cx="22" cy="30" r="2" fill="currentColor" />
            {/* Right */}
            <path d="M36 32 Q42 26, 48 28" strokeWidth="1.5" />
            <path d="M36 32 Q42 34, 48 30" strokeWidth="1.5" />
            <circle cx="42" cy="30" r="2" fill="currentColor" />
        </svg>
    ),
    'Upturned': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left upturned eye — outer corner lifts (cat eye) */}
            <path d="M16 32 Q22 26, 28 28" strokeWidth="1.5" />
            <path d="M16 32 Q22 34, 28 30" strokeWidth="1.5" />
            <circle cx="22" cy="30" r="2" fill="currentColor" />
            {/* Right */}
            <path d="M36 28 Q42 26, 48 32" strokeWidth="1.5" />
            <path d="M36 30 Q42 34, 48 32" strokeWidth="1.5" />
            <circle cx="42" cy="30" r="2" fill="currentColor" />
        </svg>
    ),
    'Deep-set': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Left deep-set — set back, strong brow bone shadow */}
            <path d="M14 26 Q22 22, 30 26" strokeWidth="2" opacity="0.4" />{/* brow bone */}
            <path d="M18 32 Q22 30, 26 32" strokeWidth="1.5" />
            <path d="M18 32 Q22 34, 26 32" strokeWidth="1.5" />
            <circle cx="22" cy="32" r="1.5" fill="currentColor" />
            {/* Right */}
            <path d="M34 26 Q42 22, 50 26" strokeWidth="2" opacity="0.4" />
            <path d="M38 32 Q42 30, 46 32" strokeWidth="1.5" />
            <path d="M38 32 Q42 34, 46 32" strokeWidth="1.5" />
            <circle cx="42" cy="32" r="1.5" fill="currentColor" />
        </svg>
    ),
};

// ============================================
// NOSE ICONS (front-facing, nostrils + bridge)
// ============================================
export const NoseIcons: Record<string, React.FC<IconProps>> = {
    'Straight': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Straight bridge */}
            <line x1="32" y1="20" x2="32" y2="40" strokeWidth="1.5" />
            {/* Nostrils */}
            <path d="M28 42 Q26 44, 28 46" strokeWidth="1.5" />
            <path d="M36 42 Q38 44, 36 46" strokeWidth="1.5" />
            {/* Nose tip connection */}
            <path d="M28 42 Q32 40, 36 42" strokeWidth="1" opacity="0.3" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            <line x1="32" y1="20" x2="32" y2="38" strokeWidth="1.5" />
            {/* Wide nostrils */}
            <path d="M24 42 Q22 46, 26 46" strokeWidth="1.5" />
            <path d="M40 42 Q42 46, 38 46" strokeWidth="1.5" />
            <path d="M26 42 Q32 38, 38 42" strokeWidth="1" opacity="0.3" />
        </svg>
    ),
    'Hooked': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Hooked bridge with bump */}
            <path d="M30 20 Q34 28, 36 32 Q34 38, 32 40" strokeWidth="1.5" fill="none" />
            <path d="M28 42 Q26 44, 28 46" strokeWidth="1.5" />
            <path d="M36 42 Q38 44, 36 46" strokeWidth="1.5" />
            <path d="M28 42 Q32 40, 36 42" strokeWidth="1" opacity="0.3" />
        </svg>
    ),
    'Button': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Short bridge, round tip */}
            <path d="M32 24 Q32 32, 34 36 Q32 40, 30 36 Q32 32, 32 24" strokeWidth="1.5" fill="none" />
            {/* Small rounded nostrils */}
            <path d="M28 40 Q27 42, 29 42" strokeWidth="1.2" />
            <path d="M36 40 Q37 42, 35 42" strokeWidth="1.2" />
        </svg>
    ),
    'Aquiline': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Curved aquiline bridge */}
            <path d="M30 18 C34 24, 36 30, 32 40" strokeWidth="1.5" fill="none" />
            <path d="M28 42 Q26 44, 28 46" strokeWidth="1.5" />
            <path d="M36 42 Q38 44, 36 46" strokeWidth="1.5" />
            <path d="M28 42 Q32 40, 36 42" strokeWidth="1" opacity="0.3" />
        </svg>
    ),
    'Snub': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Short upturned nose */}
            <path d="M32 26 Q33 32, 36 36 Q34 38, 32 38" strokeWidth="1.5" fill="none" />
            {/* Visible nostrils from below */}
            <ellipse cx="29" cy="42" rx="2.5" ry="1.5" strokeWidth="1" opacity="0.5" />
            <ellipse cx="35" cy="42" rx="2.5" ry="1.5" strokeWidth="1" opacity="0.5" />
        </svg>
    ),
};

// ============================================
// LIP ICONS
// ============================================
export const LipIcons: Record<string, React.FC<IconProps>> = {
    'Thin': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Thin lips — narrow gap */}
            <path d="M20 38 Q32 35, 44 38" strokeWidth="1" />{/* upper */}
            <path d="M20 38 Q32 40, 44 38" strokeWidth="1" />{/* lower */}
        </svg>
    ),
    'Full': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Full plump lips */}
            <path d="M20 36 Q32 30, 44 36" strokeWidth="1.5" />
            <path d="M20 36 Q32 44, 44 36" strokeWidth="1.5" />
            <path d="M20 36 Q32 44, 44 36" fill="currentColor" opacity="0.12" strokeWidth="0" />
        </svg>
    ),
    'Bow-Shaped': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Cupid's bow */}
            <path d="M20 36 Q26 32, 32 36 Q38 32, 44 36" strokeWidth="1.5" />
            <path d="M20 36 Q32 44, 44 36" strokeWidth="1.5" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Wide lips — extend further */}
            <path d="M14 36 Q32 32, 50 36" strokeWidth="1.5" />
            <path d="M14 36 Q32 42, 50 36" strokeWidth="1.5" />
        </svg>
    ),
    'Heart': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Heart lips with defined cupid's bow */}
            <path d="M22 36 Q27 30, 32 36 Q37 30, 42 36" strokeWidth="1.5" />
            <path d="M22 36 Q32 46, 42 36" strokeWidth="1.5" />
            {/* Cupid's bow point */}
            <circle cx="32" cy="34" r="0.8" fill="currentColor" opacity="0.5" />
        </svg>
    ),
};

// ============================================
// JAWLINE ICONS
// ============================================
export const JawlineIcons: Record<string, React.FC<IconProps>> = {
    'Sharp': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M16 12 L16 36 L32 54 L48 36 L48 12" />
        </svg>
    ),
    'Rounded': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M16 12 L16 32 Q16 50, 32 54 Q48 50, 48 32 L48 12" />
        </svg>
    ),
    'Square': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M16 12 L16 42 L22 50 L42 50 L48 42 L48 12" />
        </svg>
    ),
    'Pointed': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M18 12 L16 38 L32 56 L48 38 L46 12" />
        </svg>
    ),
    'Wide': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M12 12 L12 38 Q12 52, 32 54 Q52 52, 52 38 L52 12" />
        </svg>
    ),
};

// ============================================
// ACCESSORY ICONS
// ============================================
export const AccessoryIcons: Record<string, React.FC<IconProps>> = {
    'None': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="32" cy="32" r="16" strokeDasharray="4 4" opacity="0.25" />
            <line x1="20" y1="20" x2="44" y2="44" opacity="0.35" />
        </svg>
    ),
    'Eyeglasses': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            <circle cx="22" cy="30" r="8" />
            <circle cx="42" cy="30" r="8" />
            <path d="M30 30 L34 30" />
            <line x1="14" y1="28" x2="12" y2="26" />
            <line x1="50" y1="28" x2="52" y2="26" />
        </svg>
    ),
    'Sunglasses': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            <rect x="12" y="24" width="16" height="12" rx="3" fill="currentColor" opacity="0.25" />
            <rect x="36" y="24" width="16" height="12" rx="3" fill="currentColor" opacity="0.25" />
            <path d="M28 30 L36 30" />
            <line x1="12" y1="28" x2="10" y2="26" />
            <line x1="52" y1="28" x2="54" y2="26" />
        </svg>
    ),
    'Baseball Cap': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace cy={36} />
            <path d="M14 30 Q14 14, 32 12 Q50 14, 50 30" />
            <line x1="14" y1="30" x2="50" y2="30" />
            <path d="M14 30 L6 36 L18 36" fill="currentColor" opacity="0.15" />
        </svg>
    ),
    'Beanie': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace cy={36} />
            <path d="M14 32 Q14 14, 32 10 Q50 14, 50 32" />
            <line x1="14" y1="32" x2="50" y2="32" />
            <circle cx="32" cy="8" r="3" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'Earrings': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Dangling earrings */}
            <line x1="14" y1="32" x2="14" y2="38" strokeWidth="1" />
            <circle cx="14" cy="40" r="3" fill="currentColor" opacity="0.35" />
            <line x1="50" y1="32" x2="50" y2="38" strokeWidth="1" />
            <circle cx="50" cy="40" r="3" fill="currentColor" opacity="0.35" />
        </svg>
    ),
    'Headband': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            <path d="M14 26 Q14 16, 32 14 Q50 16, 50 26" />
            <path d="M16 22 Q16 14, 32 12 Q48 14, 48 22" strokeWidth="4" opacity="0.3" />
        </svg>
    ),
};

// ============================================
// SKIN/AGE ICONS
// ============================================
export const SkinAgeIcons: Record<string, React.FC<IconProps>> = {
    'Smooth': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" />
            {/* Clean face - minimal features */}
            <circle cx="24" cy="28" r="1" fill="currentColor" opacity="0.3" />
            <circle cx="40" cy="28" r="1" fill="currentColor" opacity="0.3" />
        </svg>
    ),
    'Wrinkled': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" />
            {/* Crow's feet wrinkles */}
            <path d="M18 26 Q20 28, 18 30" strokeWidth="1" opacity="0.5" />
            <path d="M46 26 Q44 28, 46 30" strokeWidth="1" opacity="0.5" />
            {/* Forehead lines */}
            <path d="M24 18 Q32 16, 40 18" strokeWidth="0.8" opacity="0.4" />
            <path d="M25 21 Q32 19, 39 21" strokeWidth="0.8" opacity="0.4" />
            {/* Nasolabial folds */}
            <path d="M26 34 Q24 40, 26 44" strokeWidth="0.8" opacity="0.4" />
            <path d="M38 34 Q40 40, 38 44" strokeWidth="0.8" opacity="0.4" />
        </svg>
    ),
    'Scarred': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" />
            {/* Scar line */}
            <path d="M36 20 L40 32" strokeWidth="2" />
            {/* Stitch marks */}
            <line x1="36" y1="23" x2="38" y2="22" strokeWidth="1" />
            <line x1="37" y1="26" x2="39" y2="25" strokeWidth="1" />
            <line x1="38" y1="29" x2="40" y2="28" strokeWidth="1" />
        </svg>
    ),
    'Freckled': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" />
            {/* Freckle clusters on cheeks and nose */}
            <g fill="currentColor" opacity="0.45">
                <circle cx="24" cy="30" r="1" /><circle cx="22" cy="34" r="0.8" />
                <circle cx="26" cy="32" r="0.8" /><circle cx="28" cy="34" r="1" />
                <circle cx="36" cy="34" r="1" /><circle cx="40" cy="30" r="1" />
                <circle cx="38" cy="32" r="0.8" /><circle cx="42" cy="34" r="0.8" />
                <circle cx="30" cy="30" r="0.8" /><circle cx="34" cy="30" r="0.8" />
            </g>
        </svg>
    ),
    'Aged': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" />
            {/* Under-eye bags */}
            <path d="M22 30 Q24 32, 26 30" strokeWidth="0.8" opacity="0.4" />
            <path d="M38 30 Q40 32, 42 30" strokeWidth="0.8" opacity="0.4" />
            {/* Forehead lines */}
            <path d="M24 17 Q32 15, 40 17" strokeWidth="0.8" opacity="0.35" />
            {/* Jowl lines */}
            <path d="M22 42 Q20 46, 22 48" strokeWidth="0.8" opacity="0.4" />
            <path d="M42 42 Q44 46, 42 48" strokeWidth="0.8" opacity="0.4" />
            {/* Age spots */}
            <circle cx="38" cy="22" r="1.5" fill="currentColor" opacity="0.15" />
            <circle cx="26" cy="44" r="1.2" fill="currentColor" opacity="0.15" />
        </svg>
    ),
};

// ============================================
// EAR ICONS (with inner helix detail)
// ============================================
export const EarIcons: Record<string, React.FC<IconProps>> = {
    'Small': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Small ear on left side */}
            <path d="M14 26 Q8 28, 8 32 Q8 36, 14 38" strokeWidth="1.5" />
            {/* Inner helix */}
            <path d="M13 28 Q10 30, 10 32 Q10 34, 13 36" strokeWidth="1" opacity="0.4" />
        </svg>
    ),
    'Large': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Large ear */}
            <path d="M14 22 Q4 26, 4 32 Q4 40, 14 44" strokeWidth="1.5" />
            {/* Inner helix */}
            <path d="M13 25 Q7 28, 7 32 Q7 38, 13 41" strokeWidth="1" opacity="0.4" />
        </svg>
    ),
    'Protruding': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Protruding ear — sticks out further */}
            <path d="M14 24 Q0 28, 0 34 Q0 40, 14 42" strokeWidth="1.5" />
            {/* Inner helix */}
            <path d="M12 27 Q4 30, 4 34 Q4 38, 12 40" strokeWidth="1" opacity="0.4" />
        </svg>
    ),
    'Attached Lobes': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Ear with attached lobe — lobe merges into jaw */}
            <path d="M14 24 Q6 28, 6 32 Q6 38, 10 40 L14 40" strokeWidth="1.5" />
            {/* Inner helix */}
            <path d="M13 26 Q8 29, 8 32 Q8 36, 12 38" strokeWidth="1" opacity="0.4" />
        </svg>
    ),
    'Detached Lobes': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <GhostFace />
            {/* Ear with freely hanging lobe */}
            <path d="M14 24 Q6 28, 6 32 Q6 36, 10 38" strokeWidth="1.5" />
            <path d="M10 38 Q8 42, 10 44 Q12 44, 14 42" strokeWidth="1.5" />
            {/* Inner helix */}
            <path d="M13 26 Q8 29, 8 32 Q8 35, 11 37" strokeWidth="1" opacity="0.4" />
        </svg>
    ),
};

// ============================================
// CHEEKBONE ICONS
// ============================================
export const CheekboneIcons: Record<string, React.FC<IconProps>> = {
    'High': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" opacity="0.5" />
            {/* High cheekbone highlight arcs — near eyes */}
            <path d="M16 26 Q20 24, 24 28" strokeWidth="2" opacity="0.6" />
            <path d="M48 26 Q44 24, 40 28" strokeWidth="2" opacity="0.6" />
            {/* Subtle fill */}
            <path d="M16 26 Q20 24, 24 28 Q20 28, 16 26Z" fill="currentColor" opacity="0.1" />
            <path d="M48 26 Q44 24, 40 28 Q44 28, 48 26Z" fill="currentColor" opacity="0.1" />
        </svg>
    ),
    'Low': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" opacity="0.5" />
            {/* Low cheekbone arcs — near mouth level */}
            <path d="M16 36 Q20 34, 24 38" strokeWidth="2" opacity="0.6" />
            <path d="M48 36 Q44 34, 40 38" strokeWidth="2" opacity="0.6" />
            <path d="M16 36 Q20 34, 24 38 Q20 38, 16 36Z" fill="currentColor" opacity="0.1" />
            <path d="M48 36 Q44 34, 40 38 Q44 38, 48 36Z" fill="currentColor" opacity="0.1" />
        </svg>
    ),
    'Prominent': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" opacity="0.5" />
            {/* Prominent — larger, more visible arcs */}
            <path d="M14 28 Q20 24, 26 30" strokeWidth="2.5" opacity="0.6" />
            <path d="M50 28 Q44 24, 38 30" strokeWidth="2.5" opacity="0.6" />
            <ellipse cx="20" cy="28" rx="5" ry="3" fill="currentColor" opacity="0.12" />
            <ellipse cx="44" cy="28" rx="5" ry="3" fill="currentColor" opacity="0.12" />
        </svg>
    ),
    'Flat': ({ className }) => (
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <ellipse cx="32" cy="32" rx="16" ry="20" opacity="0.5" />
            {/* Flat — very subtle, almost straight lines */}
            <line x1="18" y1="30" x2="26" y2="30" strokeWidth="1" opacity="0.35" />
            <line x1="38" y1="30" x2="46" y2="30" strokeWidth="1" opacity="0.35" />
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
