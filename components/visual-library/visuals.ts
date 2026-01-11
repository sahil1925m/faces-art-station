import { VisualFeatureCategory } from '../../types';

// Comprehensive visual library for forensic composite creation
// Each feature has a label, preview identifier, and prompt for AI generation

export const visualLibrary: VisualFeatureCategory[] = [
    {
        id: 'faceShape',
        name: 'Face Shape',
        features: [
            { label: 'Oval', preview: 'oval-face', prompt: 'an oval face shape' },
            { label: 'Square', preview: 'square-face', prompt: 'a square face shape' },
            { label: 'Round', preview: 'round-face', prompt: 'a round face shape' },
            { label: 'Heart', preview: 'heart-face', prompt: 'a heart-shaped face' },
            { label: 'Long', preview: 'long-face', prompt: 'a long, elongated face shape' },
            { label: 'Diamond', preview: 'diamond-face', prompt: 'a diamond-shaped face with wide cheekbones' },
        ],
    },
    {
        id: 'hairStyle',
        name: 'Hairstyles',
        features: [
            { label: 'Bald', preview: 'bald', prompt: 'a bald head, no hair' },
            { label: 'Buzzcut', preview: 'buzzcut', prompt: 'a very short buzzcut hairstyle' },
            { label: 'Short', preview: 'short-hair', prompt: 'short, neat hair' },
            { label: 'Wavy', preview: 'wavy-hair', prompt: 'medium-length wavy hair' },
            { label: 'Long', preview: 'long-hair', prompt: 'long, straight hair past the shoulders' },
            { label: 'Curly', preview: 'curly-hair', prompt: 'curly, textured hair' },
            { label: 'Afro', preview: 'afro', prompt: 'a full afro hairstyle' },
            { label: 'Ponytail', preview: 'ponytail', prompt: 'hair tied back in a ponytail' },
        ],
    },
    {
        id: 'facialHair',
        name: 'Facial Hair',
        features: [
            { label: 'Clean Shaven', preview: 'clean-shaven', prompt: 'a clean-shaven face, no facial hair' },
            { label: 'Stubble', preview: 'stubble', prompt: 'light stubble, 5 o\'clock shadow' },
            { label: 'Mustache', preview: 'mustache', prompt: 'a prominent mustache' },
            { label: 'Goatee', preview: 'goatee', prompt: 'a goatee beard' },
            { label: 'Full Beard', preview: 'full-beard', prompt: 'a full, thick beard' },
            { label: 'Soul Patch', preview: 'soul-patch', prompt: 'a small soul patch under the lower lip' },
            { label: 'Mutton Chops', preview: 'mutton-chops', prompt: 'mutton chop sideburns' },
        ],
    },
    {
        id: 'eyebrows',
        name: 'Eyebrows',
        features: [
            { label: 'Arched', preview: 'arched-brows', prompt: 'highly arched eyebrows' },
            { label: 'Straight', preview: 'straight-brows', prompt: 'straight, horizontal eyebrows' },
            { label: 'Rounded', preview: 'rounded-brows', prompt: 'softly rounded eyebrows' },
            { label: 'Angled', preview: 'angled-brows', prompt: 'sharply angled eyebrows' },
            { label: 'Thick', preview: 'thick-brows', prompt: 'thick, bushy eyebrows' },
            { label: 'Thin', preview: 'thin-brows', prompt: 'thin, delicate eyebrows' },
        ],
    },
    {
        id: 'eyes',
        name: 'Eye Shape',
        features: [
            { label: 'Almond', preview: 'almond-eyes', prompt: 'almond-shaped eyes' },
            { label: 'Round', preview: 'round-eyes', prompt: 'large, round eyes' },
            { label: 'Hooded', preview: 'hooded-eyes', prompt: 'hooded eyes with heavy lids' },
            { label: 'Downturned', preview: 'downturned-eyes', prompt: 'downturned, droopy eyes' },
            { label: 'Upturned', preview: 'upturned-eyes', prompt: 'upturned cat-like eyes' },
            { label: 'Deep-set', preview: 'deep-set-eyes', prompt: 'deep-set eyes set back in the skull' },
        ],
    },
    {
        id: 'nose',
        name: 'Nose Shape',
        features: [
            { label: 'Straight', preview: 'straight-nose', prompt: 'a straight, narrow nose' },
            { label: 'Wide', preview: 'wide-nose', prompt: 'a wide, broad nose' },
            { label: 'Hooked', preview: 'hooked-nose', prompt: 'a hooked, aquiline nose' },
            { label: 'Button', preview: 'button-nose', prompt: 'a small, rounded button nose' },
            { label: 'Aquiline', preview: 'aquiline-nose', prompt: 'a prominent aquiline nose with a curved bridge' },
            { label: 'Snub', preview: 'snub-nose', prompt: 'a short, upturned snub nose' },
        ],
    },
    {
        id: 'lips',
        name: 'Lip Shape',
        features: [
            { label: 'Thin', preview: 'thin-lips', prompt: 'thin, narrow lips' },
            { label: 'Full', preview: 'full-lips', prompt: 'full, plump lips' },
            { label: 'Bow-Shaped', preview: 'bow-lips', prompt: 'a pronounced cupid\'s bow lip shape' },
            { label: 'Wide', preview: 'wide-lips', prompt: 'wide lips extending across the face' },
            { label: 'Heart', preview: 'heart-lips', prompt: 'heart-shaped lips with a defined cupid\'s bow' },
        ],
    },
    {
        id: 'jawline',
        name: 'Jawline',
        features: [
            { label: 'Sharp', preview: 'sharp-jaw', prompt: 'a sharp, chiseled jawline' },
            { label: 'Rounded', preview: 'rounded-jaw', prompt: 'a soft, rounded jawline' },
            { label: 'Square', preview: 'square-jaw', prompt: 'a strong, square jawline' },
            { label: 'Pointed', preview: 'pointed-jaw', prompt: 'a pointed, narrow chin' },
            { label: 'Wide', preview: 'wide-jaw', prompt: 'a wide, broad jawline' },
        ],
    },
    {
        id: 'cheekbones',
        name: 'Cheekbones',
        features: [
            { label: 'High', preview: 'high-cheekbones', prompt: 'high, prominent cheekbones' },
            { label: 'Low', preview: 'low-cheekbones', prompt: 'low-set cheekbones' },
            { label: 'Prominent', preview: 'prominent-cheekbones', prompt: 'very prominent, defined cheekbones' },
            { label: 'Flat', preview: 'flat-cheekbones', prompt: 'flat, subtle cheekbones' },
        ],
    },
    {
        id: 'ears',
        name: 'Ears',
        features: [
            { label: 'Small', preview: 'small-ears', prompt: 'small, close-set ears' },
            { label: 'Large', preview: 'large-ears', prompt: 'large, prominent ears' },
            { label: 'Protruding', preview: 'protruding-ears', prompt: 'ears that stick out from the head' },
            { label: 'Attached Lobes', preview: 'attached-lobes', prompt: 'earlobes attached to the head' },
            { label: 'Detached Lobes', preview: 'detached-lobes', prompt: 'earlobes that hang freely' },
        ],
    },
    {
        id: 'skinAge',
        name: 'Skin Texture',
        features: [
            { label: 'Smooth', preview: 'smooth-skin', prompt: 'smooth, youthful skin texture' },
            { label: 'Wrinkled', preview: 'wrinkled-skin', prompt: 'wrinkled, aged skin with visible lines' },
            { label: 'Scarred', preview: 'scarred-skin', prompt: 'skin with visible scars' },
            { label: 'Freckled', preview: 'freckled-skin', prompt: 'skin with freckles' },
            { label: 'Aged', preview: 'aged-skin', prompt: 'mature, aged skin with age spots and lines' },
        ],
    },
    {
        id: 'accessories',
        name: 'Accessories',
        features: [
            { label: 'None', preview: 'none', prompt: 'no eyewear or headwear' },
            { label: 'Eyeglasses', preview: 'eyeglasses', prompt: 'wearing prescription eyeglasses' },
            { label: 'Sunglasses', preview: 'sunglasses', prompt: 'wearing dark sunglasses' },
            { label: 'Baseball Cap', preview: 'baseball-cap', prompt: 'wearing a baseball cap' },
            { label: 'Beanie', preview: 'beanie', prompt: 'wearing a knit beanie hat' },
            { label: 'Earrings', preview: 'earrings', prompt: 'wearing earrings' },
            { label: 'Headband', preview: 'headband', prompt: 'wearing a headband' },
        ],
    },
];