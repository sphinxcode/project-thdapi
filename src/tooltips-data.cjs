/**
 * Human Design Tooltips Data
 * Comprehensive tooltip descriptions for all HD elements
 * This data is embedded directly (not imported from JSON) to avoid deployment issues
 */

const TOOLTIPS = {
    types: {
        "Manifestor": {
            name: "Manifestor",
            description: "Initiators representing 9% of population with closed, repelling aura designed to impact others. Strategy: Inform before acting to find peace and reduce resistance.",
            link: "/learn/types/manifestor"
        },
        "Generator": {
            name: "Generator",
            description: "Builders with sustainable sacral life-force (37% of population). Designed to respond to life and find satisfaction through correct work. Strategy: Wait to respond.",
            link: "/learn/types/generator"
        },
        "Manifesting Generator": {
            name: "Manifesting Generator",
            description: "Multi-passionate hybrid (33%) combining Generator's sacral power with Manifestor's speed. Can skip steps efficiently. Strategy: Respond first, then inform.",
            link: "/learn/types/manifesting-generator"
        },
        "Projector": {
            name: "Projector",
            description: "Natural guides and managers (22%) with focused, penetrating aura designed to see into others. Strategy: Wait for recognition and invitation to share wisdom.",
            link: "/learn/types/projector"
        },
        "Reflector": {
            name: "Reflector",
            description: "Rare mirrors of humanity (1%) with all centers open, designed to sample and reflect community health. Strategy: Wait full lunar cycle (28 days) for clarity.",
            link: "/learn/types/reflector"
        }
    },

    authorities: {
        "Emotional": {
            name: "Emotional Authority",
            description: "Decision-making through emotional clarity over time. No truth in the now - ride the wave from high to low to find what remains consistent.",
            link: "/learn/authority/emotional"
        },
        "Sacral": {
            name: "Sacral Authority",
            description: "Immediate gut response in the present moment. Listen for 'uh-huh' (yes) or 'uh-uh' (no) sounds before mind engages - truth in the now.",
            link: "/learn/authority/sacral"
        },
        "Splenic": {
            name: "Splenic Authority",
            description: "In-the-moment intuitive awareness that speaks once and doesn't repeat. Spontaneous survival instinct operating in present - trust first hit.",
            link: "/learn/authority/splenic"
        },
        "Ego": {
            name: "Ego Authority",
            description: "Willpower-based decisions from the heart. Ask 'What do I want?' and 'What's in it for me?' - trust your desires and commitments.",
            link: "/learn/authority/ego"
        },
        "Self-Projected": {
            name: "Self-Projected Authority",
            description: "Clarity through hearing yourself speak. Talk decisions through with trusted others and listen to your own voice for truth that emerges.",
            link: "/learn/authority/self-projected"
        },
        "Mental": {
            name: "Mental/Environmental Authority",
            description: "No internal authority - designed to process decisions through correct environment and trusted sounding boards. Clarity comes from outside perspective and place.",
            link: "/learn/authority/mental"
        },
        "Lunar": {
            name: "Lunar Authority",
            description: "Reflector-only authority through lunar cycle. Wait 28+ days to experience decision through all lunar gates before committing to major choices.",
            link: "/learn/authority/lunar"
        }
    },

    profiles: {
        "1/3": {
            name: "Investigator/Martyr",
            description: "Build secure foundations through investigation, then discover what works through trial and error. Foundation through research meets discovery through experimentation.",
            link: "/learn/profiles/1-3"
        },
        "1/4": {
            name: "Investigator/Opportunist",
            description: "Ground yourself in solid knowledge while building influential networks. Research creates security that enables relationship-based opportunities.",
            link: "/learn/profiles/1-4"
        },
        "2/4": {
            name: "Hermit/Opportunist",
            description: "Natural talents emerge in solitude but flourish through connections. Balance hermit's need for alone time with opportunist's network building.",
            link: "/learn/profiles/2-4"
        },
        "2/5": {
            name: "Hermit/Heretic",
            description: "Natural problem-solver carrying others' projections. Called from hermit cave to provide practical solutions, then return to solitude to recharge.",
            link: "/learn/profiles/2-5"
        },
        "3/5": {
            name: "Martyr/Heretic",
            description: "Learn through experimentation and mistakes, then offer those lessons as solutions to others. Trial and error becomes practical wisdom for collective.",
            link: "/learn/profiles/3-5"
        },
        "3/6": {
            name: "Martyr/Role Model",
            description: "Three life phases: experimentation (0-30), withdrawal (30-50), wisdom (50+). Trial and error transforms into lived example for others.",
            link: "/learn/profiles/3-6"
        },
        "4/6": {
            name: "Opportunist/Role Model",
            description: "Influential networker maturing into wise example. Build foundation through relationships, withdraw to integrate, emerge as transpersonal role model.",
            link: "/learn/profiles/4-6"
        },
        "4/1": {
            name: "Opportunist/Investigator",
            description: "Network influence built on researched foundation. Unconscious investigator provides security for conscious relationship-based influence.",
            link: "/learn/profiles/4-1"
        },
        "5/1": {
            name: "Heretic/Investigator",
            description: "Practical solutions backed by solid research. Projected onto as savior but only deliver when standing on firm investigative ground.",
            link: "/learn/profiles/5-1"
        },
        "5/2": {
            name: "Heretic/Hermit",
            description: "Reluctant problem-solver with natural talents. Called to provide solutions but craves solitude - carefully manage projection fields.",
            link: "/learn/profiles/5-2"
        },
        "6/2": {
            name: "Role Model/Hermit",
            description: "Living example of authentic self-acceptance. Wise transpersonal perspective meets natural hermit talent - model self-love and trust unique gifts.",
            link: "/learn/profiles/6-2"
        },
        "6/3": {
            name: "Role Model/Martyr",
            description: "Chaotic experimentation phase transforms through reflection into mature wisdom. Role model emerges from lived experience of what works through trial.",
            link: "/learn/profiles/6-3"
        }
    },

    definitions: {
        "Single": {
            name: "Single Definition",
            description: "All defined centers connected in one continuous circuit. Self-contained with consistent energy flow and independent decision-making - complete within yourself.",
            link: "/learn/definition/single"
        },
        "Split": {
            name: "Split Definition",
            description: "Two separate areas of definition seeking bridging energy. Drawn to others who connect your split - relationship-oriented by design.",
            link: "/learn/definition/split"
        },
        "Triple Split": {
            name: "Triple Split Definition",
            description: "Three separate circuits requiring multiple connections. Complex energy needing variety in relationships and environments to experience wholeness.",
            link: "/learn/definition/triple-split"
        },
        "Quadruple Split": {
            name: "Quadruple Split Definition",
            description: "Four separate circuits - rarest configuration (< 1%). Highly complex requiring patience and multiple specific bridges - deeply fixed yet needs completion through others.",
            link: "/learn/definition/quadruple-split"
        },
        "No Definition": {
            name: "No Definition",
            description: "Reflector-only configuration with all centers open. Completely receptive, sampling and reflecting energy around you with no fixed identity or consistency.",
            link: "/learn/definition/no"
        }
    },

    variables: {
        "PLL DLL": {
            name: "PLL DLL - Hades (Shark)",
            description: "Type 1 'Shark' - Focused mind, always active and hard-working. Actively takes charge of survival, focuses on objectives, thinks competitively. Expert with enormous staying power, sharp concentration. Perfectionist with fear of failure.",
            link: "/learn/variables/pll-dll"
        },
        "PLL DLR": {
            name: "PLL DLR - Kali (Lion)",
            description: "Type 2 'Lion' - Focused mind, laid-back yet alert. Charges own survival, loves to relax while seeing what's next. Mentally active, responds strategically when right person near.",
            link: "/learn/variables/pll-dlr"
        },
        "PLL DRL": {
            name: "PLL DRL - Minerva (Dolphin)",
            description: "Type 3 'Dolphin' - Focused mind, meditative activity. Indulges contemplatively in favorite activity, extremely present in now. One thing at a time into focus. Wealth of knowledge.",
            link: "/learn/variables/pll-drl"
        },
        "PLL DRR": {
            name: "PLL DRR - Ma'at (Panda)",
            description: "Type 4 'Panda' - Focused mind in flow. Passive flow with experiences, relaxed body while mentally focusing to become expert. Strategic thinking with relaxed body. Listen to body wisdom.",
            link: "/learn/variables/pll-drr"
        },
        "PLR DLL": {
            name: "PLR DLL - Prometheus (Dog)",
            description: "Type 5 'Dog' - Universal mind, always active. Charges survival, works on goals while playfully observing everything. Looks for one thing, finds everything. Sees what others can't.",
            link: "/learn/variables/plr-dll"
        },
        "PLR DLR": {
            name: "PLR DLR - Mitra (Cat)",
            description: "Type 6 'Cat' - Universal mind, laid-back. Charges survival, relaxes while playfully observing with changing focus. Acts strategically when interested or danger. Life can't be planned.",
            link: "/learn/variables/plr-dlr"
        },
        "PLR DRL": {
            name: "PLR DRL - Christ Consciousness (Horse)",
            description: "Type 7 'Horse' - Universal mind, meditative activity. Indulges in favorite activity as relaxation, playfully observes everything. Likes experiments, acute perception, gathers wisdom through activity.",
            link: "/learn/variables/plr-drl"
        },
        "PLR DRR": {
            name: "PLR DRR - Parvati (Rabbit)",
            description: "Type 8 'Rabbit' - Universal mind in flow. Passive flow, relaxed, playfully observes with changing focus. Life is unplannable experiences. Very alert in now to attract right people.",
            link: "/learn/variables/plr-drr"
        },
        "PRL DLL": {
            name: "PRL DLL - Vishnu (Bee)",
            description: "Type 9 'Bee' - Relationship-minded, always active. Charges survival, works hard for objectives, very relationship-minded. Present and productive for benefit of relationships. Needs matching stimulating relationships.",
            link: "/learn/variables/prl-dll"
        },
        "PRL DLR": {
            name: "PRL DLR - Michael (Owl)",
            description: "Type 10 'Owl' - Relationship-minded, laid-back. Charges survival, relaxed, relationship-minded. Sees all details in people, deeply absorbs. Needs matching relationships to reflect awareness.",
            link: "/learn/variables/prl-dlr"
        },
        "PRL DRL": {
            name: "PRL DRL - Harmonia (Camel)",
            description: "Type 11 'Camel' - Relationship-minded, meditative activity. Indulges in favorite activity, very relationship-minded. Deeply focuses on others without objective. Modest with more knowledge than expected.",
            link: "/learn/variables/prl-drl"
        },
        "PRL DRR": {
            name: "PRL DRR - Lakshmi (Sheep)",
            description: "Type 12 'Sheep' - Relationship-minded in flow. Passive flow, relaxed, focuses receptively on subject/person without intention. Resource for others, gathers knowledge from experiences.",
            link: "/learn/variables/prl-drr"
        },
        "PRR DLL": {
            name: "PRR DLL - Keepers of Wheel (Bear)",
            description: "Type 13 'Bear' - No-mindedness, always active. Charges survival, focuses on objectives. Observes self while life unfolds on its own. Peaceful mind when survival secured. Inwardly interested, outwardly strategic.",
            link: "/learn/variables/prr-dll"
        },
        "PRR DLR": {
            name: "PRR DLR - Janus (Octopus)",
            description: "Type 14 'Octopus' - No-mindedness, laid-back. Charges survival, relaxed, receptive to environment. Observes self in experiences while body acts as active anchor. Accumulates knowledge through experiences.",
            link: "/learn/variables/prr-dlr"
        },
        "PRR DRL": {
            name: "PRR DRL - Thoth (Cow)",
            description: "Type 15 'Cow' - No-mindedness, meditative activity. Focused on favorite activity contemplatively, absorbs everything without strategic plan. Activity keeps mind at ease, fruits valuable for others.",
            link: "/learn/variables/prr-drl"
        },
        "PRR DRR": {
            name: "PRR DRR - Maia (Alf)",
            description: "Type 16 'Alf' - No-mindedness in flow. Passive flow, receptive to environment. Life unfolds with ease in the now without pressure. Depth of awareness from experiences transforms others.",
            link: "/learn/variables/prr-drr"
        }
    },

    centers: {
        "Head": {
            name: "Head Center",
            description: "Inspiration and mental pressure. Defined: consistent inspiration. Undefined: amplifies others' mental pressure - potential wisdom about what's worth thinking about.",
            link: "/learn/centers/head"
        },
        "Ajna": {
            name: "Ajna Center",
            description: "Mental awareness and conceptualization. Defined: fixed thinking process. Undefined: flexible mind open to multiple perspectives - amplifies and conditions others' concepts.",
            link: "/learn/centers/ajna"
        },
        "Throat": {
            name: "Throat Center",
            description: "Manifestation and expression hub - all energy seeks voice through throat. Defined: consistent expression. Undefined: speaks to please, struggles with timing.",
            link: "/learn/centers/throat"
        },
        "G": {
            name: "G Center (Identity)",
            description: "Love, identity, direction, and self. Defined: fixed sense of self and life direction. Undefined: searching for identity and direction through others.",
            link: "/learn/centers/g"
        },
        "Ego": {
            name: "Heart/Ego Center",
            description: "Willpower, self-worth, and material world. Defined: consistent will and value. Undefined: proving worth, inconsistent will - nothing to prove to anyone.",
            link: "/learn/centers/heart"
        },
        "SolarPlexus": {
            name: "Solar Plexus Center",
            description: "Emotional waves and feelings - most powerful motor. Defined: emotional authority, creates waves. Undefined: absorbs/amplifies emotions, seeks clarity and peace.",
            link: "/learn/centers/solar-plexus"
        },
        "Sacral": {
            name: "Sacral Center",
            description: "Life force, work energy, sexuality - pure generator power. Defined: sustainable work energy (Generators). Undefined: no consistent work force - rest and renew.",
            link: "/learn/centers/sacral"
        },
        "Spleen": {
            name: "Splenic Center",
            description: "Intuition, instinct, immune system, survival fears. Defined: reliable intuition and health awareness. Undefined: holds onto unhealthy, inconsistent instincts.",
            link: "/learn/centers/splenic"
        },
        "Root": {
            name: "Root Center",
            description: "Adrenaline pressure and stress - fuel for getting things done. Defined: consistent pressure relationship. Undefined: amplifies stress, feels rushed by others.",
            link: "/learn/centers/root"
        }
    },

    gates: {}
};

// Add all 64 gates (continued in next section due to length)
const gatesData = {
    "1": { name: "Gate 1: Self-Expression", description: "Creative expression and unique contribution from G Center. Individual knowing - 'I can/can't contribute' creatively as role model.", link: "/learn/gates/1" },
    "2": { name: "Gate 2: Direction of Self", description: "Receptive direction from higher knowing in G Center. Driver of evolution showing where humanity is heading through mutation.", link: "/learn/gates/2" },
    "3": { name: "Gate 3: Ordering/Mutation", description: "Ordering chaos through Sacral mutation. Trial and error establishing new patterns - beginning innovation one possibility at a time.", link: "/learn/gates/3" },
    "4": { name: "Gate 4: Formulization/Answers", description: "Mental answers and formulas in Ajna. Logic's youthful solutions providing answers to doubt and life's questions.", link: "/learn/gates/4" },
    "5": { name: "Gate 5: Fixed Rhythms/Waiting", description: "Universal rhythms and natural timing from Sacral. Attuned to life's flow - being in sync with patterns and cycles.", link: "/learn/gates/5" },
    "6": { name: "Gate 6: Friction/Conflict", description: "Emotional friction as motor of Solar Plexus. Conflict creates growth - intimacy requires emotional engagement and friction.", link: "/learn/gates/6" },
    "7": { name: "Gate 7: The Army/Leadership", description: "Future-focused democratic leadership in G Center. 'I lead' when invited to direct the collective forward.", link: "/learn/gates/7" },
    "8": { name: "Gate 8: Contribution", description: "Individual contribution through unique expression. Throat voice - 'I know I can/can't make a creative difference.'", link: "/learn/gates/8" },
    "9": { name: "Gate 9: Focus/Detail", description: "Sacral focus and concentration on details. Taming power through mastery - dedication to refinement and perfection.", link: "/learn/gates/9" },
    "10": { name: "Gate 10: Behavior of Self", description: "Authentic behavior in G Center. Love of self through correct action - being yourself is survival through right behavior.", link: "/learn/gates/10" },
    "11": { name: "Gate 11: Peace/Ideas", description: "Mental ideas and conceptual visions in Ajna. Peace through ideation - generating visual possibilities for consideration.", link: "/learn/gates/11" },
    "12": { name: "Gate 12: Caution/Standstill", description: "Cautious articulation waiting for mood. Individual knowing needs right timing - stillness before Throat expression.", link: "/learn/gates/12" },
    "13": { name: "Gate 13: The Listener", description: "Listening and secret-keeping in G Center. Universal fellowship - collecting stories and memories from others to reflect on past.", link: "/learn/gates/13" },
    "14": { name: "Gate 14: Power Skills", description: "Powerful Sacral skills and empowerment. Possession of great energy - fuel for correct direction and powerful momentum.", link: "/learn/gates/14" },
    "15": { name: "Gate 15: Extremes/Modesty", description: "Love of humanity and extremes. Universal flow in G Center - honoring all rhythms from intense to gentle.", link: "/learn/gates/15" },
    "16": { name: "Gate 16: Skills/Enthusiasm", description: "Skills and enthusiasm through Throat. Logical experimentation - vocal talent testing what works through practice.", link: "/learn/gates/16" },
    "17": { name: "Gate 17: Opinions/Following", description: "Mental opinions and logical patterns in Ajna. Organized thinking - conceptual frameworks structuring understanding logically.", link: "/learn/gates/17" },
    "18": { name: "Gate 18: Correction", description: "Splenic correction and perfecting awareness. Challenging what's spoilt - instinctive judgment to fix and improve patterns.", link: "/learn/gates/18" },
    "19": { name: "Gate 19: Wanting/Approach", description: "Root pressure for resources and tribal connection. Fundamental need for social bonds, food, shelter, and sustenance.", link: "/learn/gates/19" },
    "20": { name: "Gate 20: The Now/Contemplation", description: "Present moment awareness in Throat. 'I am now' - existential voice grounded entirely in present being.", link: "/learn/gates/20" },
    "21": { name: "Gate 21: Hunter/Control", description: "Ego control and willpower to overcome. Hunter/Huntress - strength to persist through interference and take charge materially.", link: "/learn/gates/21" },
    "22": { name: "Gate 22: Grace/Openness", description: "Solar Plexus grace and social openness. Individual mutation sharing beauty - emotional timing allows expression to emerge.", link: "/learn/gates/22" },
    "23": { name: "Gate 23: Assimilation", description: "Throat assimilation explaining unique knowing. Splitting complexity apart - 'I know' the acoustic truth simply without belief.", link: "/learn/gates/23" },
    "24": { name: "Gate 24: Rationalization/Returning", description: "Mental rationalization reflecting in Ajna. Individual thinking returning to ideas - knowing what deserves attention acoustically.", link: "/learn/gates/24" },
    "25": { name: "Gate 25: Spirit of Self/Innocence", description: "Innocent self-love in G Center. Universal love internalized - unconditional acceptance of being through spirit.", link: "/learn/gates/25" },
    "26": { name: "Gate 26: The Egoist", description: "Ego manipulation of memory for tribal benefit. Taming tribal stories - strategic exaggeration to sell and transmit history.", link: "/learn/gates/26" },
    "27": { name: "Gate 27: Caring/Nourishment", description: "Sacral nurturing and caring energy. Tribal nourishment - altruistic concern enhancing life quality through responsibility.", link: "/learn/gates/27" },
    "28": { name: "Gate 28: The Game Player/Risk", description: "Splenic risk assessment for meaning. Game player - determining if struggle makes life worth living through challenge.", link: "/learn/gates/28" },
    "29": { name: "Gate 29: Saying Yes/Commitment", description: "Sacral commitment to experience depth. Saying yes to life - accepting incarnation despite difficulty and unknown.", link: "/learn/gates/29" },
    "30": { name: "Gate 30: Feelings/Recognition", description: "Solar Plexus recognition of feelings. Clinging to desire - emotional hunger and fates driving experience seeking.", link: "/learn/gates/30" },
    "31": { name: "Gate 31: Leading/Influence", description: "Throat leadership requiring election. Democratic influencing - 'I lead' when chosen by collective to guide direction.", link: "/learn/gates/31" },
    "32": { name: "Gate 32: Continuity/Duration", description: "Splenic continuity and conservative endurance. Duration preserving tribal success - cautious evaluation of change and transformation.", link: "/learn/gates/32" },
    "33": { name: "Gate 33: Privacy/Retreat", description: "Throat privacy and reflective retreat. Withdrawing to process abstract experience - remembering before sharing universal lessons.", link: "/learn/gates/33" },
    "34": { name: "Gate 34: Power/Might", description: "Pure Sacral power for individual survival. Mighty generator force - raw charisma and energy maintaining powerful existence.", link: "/learn/gates/34" },
    "35": { name: "Gate 35: Progress/Change", description: "Throat manifestation seeking change. Progress through experience - expressing 'I feel' the new emotionally-driven experiences.", link: "/learn/gates/35" },
    "36": { name: "Gate 36: Crisis/Darkening Light", description: "Solar Plexus crisis of inexperience. Darkening of light - powerful emotional waves learning through the unknown.", link: "/learn/gates/36" },
    "37": { name: "Gate 37: Friendship/Family", description: "Solar Plexus friendship and tribal affection. Family bonds - part seeking whole through sensitive emotional connection and bargaining.", link: "/learn/gates/37" },
    "38": { name: "Gate 38: Fighter/Opposition", description: "Root pressure to fight for meaning. Opposition to mediocrity - struggling to preserve individual integrity and purpose.", link: "/learn/gates/38" },
    "39": { name: "Gate 39: Provocation/Obstruction", description: "Root provocation testing readiness. Obstruction teasing spirit - pressure to find correct emotional spark and readiness.", link: "/learn/gates/39" },
    "40": { name: "Gate 40: Aloneness/Deliverance", description: "Ego willpower for community delivery. Alone yet providing - will to support community in exchange for appreciation and rest.", link: "/learn/gates/40" },
    "41": { name: "Gate 41: Contraction/Decrease", description: "Root fantasy and contraction of feeling. Decrease initiating desire - fundamental pressure for new abstract experiences to come.", link: "/learn/gates/41" },
    "42": { name: "Gate 42: Growth/Increase", description: "Sacral growth through cycle completion. Increase energizing possibility - bringing maturation experiences to fruition and completion.", link: "/learn/gates/42" },
    "43": { name: "Gate 43: Insight/Breakthrough", description: "Ajna breakthrough and sudden insight. Individual knowing - unique awareness clicking into mental clarity through acoustic inner ear.", link: "/learn/gates/43" },
    "44": { name: "Gate 44: Alertness/Coming to Meet", description: "Splenic alertness to patterns and memory. Coming to meet - instinctive recognition of transformation and what works from past.", link: "/learn/gates/44" },
    "45": { name: "Gate 45: The Gatherer", description: "Throat gathering and tribal kingship. Material leadership - possessive voice of resource distribution and tribal dominance.", link: "/learn/gates/45" },
    "46": { name: "Gate 46: Determination of Self", description: "G Center determination loving the body. Pushing upward - being in right place through body awareness and serendipity.", link: "/learn/gates/46" },
    "47": { name: "Gate 47: Realization/Oppression", description: "Ajna realization making sense of past. Oppression seeking meaning - abstract mind finding pattern coherence from confusion.", link: "/learn/gates/47" },
    "48": { name: "Gate 48: Depth/The Well", description: "Splenic depth and inadequacy awareness. Well of knowledge - frustration without outlet for talent and pattern-recognition.", link: "/learn/gates/48" },
    "49": { name: "Gate 49: Rejection/Revolution", description: "Solar Plexus principles and revolution. Rejection or acceptance - tribal sensitivity to needs, values, and emotional ideals.", link: "/learn/gates/49" },
    "50": { name: "Gate 50: Values/The Cauldron", description: "Splenic values and tribal laws. The cauldron - instinctive responsibility for caring, maintaining order, and nourishing tribe.", link: "/learn/gates/50" },
    "51": { name: "Gate 51: Shock/The Arousing", description: "Ego shock and competitive initiative. Thunder arousing - willpower to lead through courage, competition, and shocking challenge.", link: "/learn/gates/51" },
    "52": { name: "Gate 52: Stillness/Inaction", description: "Root stillness and concentration. Keeping still mountain - pressured focus seeking sacral outlet for concentrated energy.", link: "/learn/gates/52" },
    "53": { name: "Gate 53: Beginnings/Development", description: "Root beginnings and development. Starting cycles - pressure to initiate growth processes and new developmental phases.", link: "/learn/gates/53" },
    "54": { name: "Gate 54: Ambition/Drive", description: "Root ambition and transformative drive. Marrying maiden - pressure to rise, transform position, and improve material standing.", link: "/learn/gates/54" },
    "55": { name: "Gate 55: Spirit/Abundance", description: "Solar Plexus abundance and spirit. Emotional fullness - mood determining quality of life experience and spiritual connection.", link: "/learn/gates/55" },
    "56": { name: "Gate 56: Stimulation/The Wanderer", description: "Throat stimulation through storytelling. The wanderer - seeking and sharing tales for sense-making and mental stimulation.", link: "/learn/gates/56" },
    "57": { name: "Gate 57: Intuition/The Gentle", description: "Splenic intuitive clarity in the now. Gentle penetration - survival awareness operating instantly with acute intuitive knowing.", link: "/learn/gates/57" },
    "58": { name: "Gate 58: Vitality/Aliveness", description: "Root vitality and joyous aliveness. Challenging patterns - life force pressuring correction, perfection, and joyful improvement.", link: "/learn/gates/58" },
    "59": { name: "Gate 59: Sexuality/Intimacy", description: "Sacral sexuality and strategic intimacy. Dispersion creating bonds - selective reproduction, intimacy, and genetic strategy.", link: "/learn/gates/59" },
    "60": { name: "Gate 60: Limitation/Acceptance", description: "Root acceptance of limitation. Evolutionary pulse - pressure to mutate and transform within natural constraints and restrictions.", link: "/learn/gates/60" },
    "61": { name: "Gate 61: Mystery/Inner Truth", description: "Head mystery and inner knowing. Pressure for truth - questioning the unknowable seeking deep understanding and inspiration.", link: "/learn/gates/61" },
    "62": { name: "Gate 62: Detail/Preponderance", description: "Throat detail and precise expression. Small things matter - articulating facts, details, and organizational logic clearly.", link: "/learn/gates/62" },
    "63": { name: "Gate 63: Doubt/After Completion", description: "Head doubt fueling logical inquiry. After completion - mental pressure ensuring thoroughness through healthy doubt.", link: "/learn/gates/63" },
    "64": { name: "Gate 64: Confusion/Before Completion", description: "Head confusion before breakthrough. Before completion - mental images and memories seeking coherent realization through abstraction.", link: "/learn/gates/64" }
};

TOOLTIPS.gates = gatesData;

// Add all 36 channels
TOOLTIPS.channels = {
    "1-8": { name: "Channel 1-8: Inspiration", description: "Creative role model bringing unique self-expression from G to Throat. Individual knowing - 'I can/can't contribute creatively.'", link: "/learn/channels/1-8" },
    "2-14": { name: "Channel 2-14: The Beat", description: "Powerful direction from Sacral to G. Keeper of keys - empowers right direction and new pathways for humanity.", link: "/learn/channels/2-14" },
    "3-60": { name: "Channel 3-60: Mutation", description: "Format energy of individual circuitry. Pulse of mutation - one new possibility at a time seeking evolution and what can work.", link: "/learn/channels/3-60" },
    "5-15": { name: "Channel 5-15: Rhythm", description: "Natural flow and universal rhythms connecting Sacral to G. Being in right place at right time through patterns.", link: "/learn/channels/5-15" },
    "6-59": { name: "Channel 6-59: Intimacy/Mating", description: "Reproductive and creative intimacy. Solar Plexus to Sacral - genetic imperative and emotional-sexual bonding.", link: "/learn/channels/6-59" },
    "7-31": { name: "Channel 7-31: The Alpha", description: "Democratic leadership connecting G to Throat. Logical collective leadership - 'I lead' when elected by group.", link: "/learn/channels/7-31" },
    "9-52": { name: "Channel 9-52: Concentration", description: "Focus and determination Root to Sacral. Format energy for logical process - concentration drives refinement and mastery.", link: "/learn/channels/9-52" },
    "10-20": { name: "Channel 10-20: Awakening", description: "Being yourself in the now. G behavior meets Throat presence - 'I know I am now' through authentic self-love.", link: "/learn/channels/10-20" },
    "10-34": { name: "Channel 10-34: Exploration", description: "Sacral power meets G behavior. Integration channel perfecting survival - being yourself through responsive powerful action.", link: "/learn/channels/10-34" },
    "10-57": { name: "Channel 10-57: Perfected Form", description: "Intuitive survival through perfected behavior. Spleen awareness guides G identity - being yourself keeps you alive intuitively.", link: "/learn/channels/10-57" },
    "11-56": { name: "Channel 11-56: Curiosity", description: "Mental seeking and storytelling. Ajna ideas meet Throat stimulation - eternal seeker sharing concepts for sense-making.", link: "/learn/channels/11-56" },
    "12-22": { name: "Channel 12-22: Openness", description: "Individual mutation meets social openness. Throat articulation waits for Solar Plexus mood - sharing when timing right.", link: "/learn/channels/12-22" },
    "13-33": { name: "Channel 13-33: The Prodigal", description: "Listening and remembering through retreat. G collects experiences, Throat reflects on universal secrets learned in cycles.", link: "/learn/channels/13-33" },
    "16-48": { name: "Channel 16-48: Wavelength", description: "Mastery through repetition and depth. Spleen awareness meets Throat skill - dedication refining talent creates unique wavelength.", link: "/learn/channels/16-48" },
    "17-62": { name: "Channel 17-62: Acceptance", description: "Logical organization of details. Ajna opinions meet Throat facts - accepting what's substantiated into structured understanding.", link: "/learn/channels/17-62" },
    "18-58": { name: "Channel 18-58: Judgment", description: "Correcting and perfecting patterns. Spleen awareness challenges Root vitality - drive to improve through critical refinement.", link: "/learn/channels/18-58" },
    "19-49": { name: "Channel 19-49: Synthesis", description: "Tribal sensitivity to needs and resources. Root pressure meets Solar Plexus principles - approach and revolution in relationships.", link: "/learn/channels/19-49" },
    "20-34": { name: "Channel 20-34: Charisma", description: "Manifesting Generator busy-ness. Sacral power meets Throat presence - charismatic action in now when responding correctly.", link: "/learn/channels/20-34" },
    "20-57": { name: "Channel 20-57: The Brainwave", description: "Intuitive clarity expressed in now. Spleen knowing meets Throat voice - 'I know I'm alive now' through penetrating awareness.", link: "/learn/channels/20-57" },
    "21-45": { name: "Channel 21-45: Money Line", description: "Tribal material control and kingship. Ego willpower meets Throat gathering - controlling resources and educating tribe materially.", link: "/learn/channels/21-45" },
    "23-43": { name: "Channel 23-43: Structuring", description: "Individual knowing and unique insight. Ajna breakthrough meets Throat assimilation - 'I know' when awareness clicks acoustically.", link: "/learn/channels/23-43" },
    "24-61": { name: "Channel 24-61: Awareness", description: "Mental rationalization seeking inner truth. Head mystery meets Ajna knowing - individual thinking solving the unknowable mentally.", link: "/learn/channels/24-61" },
    "25-51": { name: "Channel 25-51: Initiation", description: "Spirit meets willpower. G innocence meets Ego shock - unconditional love initiating through powerful competitive impact.", link: "/learn/channels/25-51" },
    "26-44": { name: "Channel 26-44: Surrender", description: "Tribal memory and sales. Ego exaggeration meets Spleen instinct - transmitting and selling tribal historical stories strategically.", link: "/learn/channels/26-44" },
    "27-50": { name: "Channel 27-50: Preservation", description: "Nurturing and responsibility. Sacral care meets Spleen values - protecting and maintaining tribal welfare through caring attention.", link: "/learn/channels/27-50" },
    "28-38": { name: "Channel 28-38: Struggle", description: "Finding meaning through challenge. Spleen risk meets Root opposition - struggling for what makes life worth living purposefully.", link: "/learn/channels/28-38" },
    "29-46": { name: "Channel 29-46: Discovery", description: "Saying yes to experience. Sacral commitment meets G body - discovering self through full engagement in life experiences.", link: "/learn/channels/29-46" },
    "30-41": { name: "Channel 30-41: Recognition", description: "Desires and new experiences. Root fantasy meets Solar Plexus feelings - emotional drive for novel abstract experiences and expansion.", link: "/learn/channels/30-41" },
    "32-54": { name: "Channel 32-54: Transformation", description: "Ambition and endurance. Root drive meets Spleen continuity - transforming position through consistent effort and tribal recognition.", link: "/learn/channels/32-54" },
    "34-57": { name: "Channel 34-57: Power", description: "Sacral power meets intuitive clarity. Archetypal survival - responding intuitively in moment keeps you alive and empowered.", link: "/learn/channels/34-57" },
    "35-36": { name: "Channel 35-36: Transitoriness", description: "Experience through change and crisis. Throat progress meets Solar Plexus inexperience - manifesting new through emotional movement.", link: "/learn/channels/35-36" },
    "37-40": { name: "Channel 37-40: Community", description: "Tribal bargaining and agreements. Solar Plexus sensitivity meets Ego willpower - emotional exchange for support in community bonds.", link: "/learn/channels/37-40" },
    "39-55": { name: "Channel 39-55: Emoting", description: "Provocation and mood. Root pressure meets Solar Plexus spirit - provoking emotional awareness and mood-driven action cycles.", link: "/learn/channels/39-55" },
    "42-53": { name: "Channel 42-53: Maturation", description: "Growth through completed cycles. Sacral growth meets Root beginnings - maturing by starting, experiencing, finishing phases.", link: "/learn/channels/42-53" },
    "47-64": { name: "Channel 47-64: Abstraction", description: "Mental confusion seeking realization. Head pressure meets Ajna sense-making - understanding patterns from past abstract experiences.", link: "/learn/channels/47-64" },
    "63-4": { name: "Channel 63-4: Logic", description: "Doubt and answers. Head questions meet Ajna formulas - logical thinking through doubt to find mental solutions systematically.", link: "/learn/channels/63-4" }
};

// Add lines
TOOLTIPS.lines = {
    "1": { name: "Line 1 - Investigator", description: "Foundation through investigation. Security-oriented research building solid ground before movement - studying to establish certainty.", link: "/learn/lines/1" },
    "2": { name: "Line 2 - Hermit", description: "Natural talent needing recognition. Hermit gifts called into action - waiting to be seen and invited out of solitude.", link: "/learn/lines/2" },
    "3": { name: "Line 3 - Martyr", description: "Trial and error experimentation. Martyr discovering through mistakes - learning what doesn't work to find what does.", link: "/learn/lines/3" },
    "4": { name: "Line 4 - Opportunist", description: "Influence through relationships and network. Opportunist building foundation through connections and friendships.", link: "/learn/lines/4" },
    "5": { name: "Line 5 - Heretic", description: "Practical solutions under projection field. Heretic carrying expectations - universal problem-solver managing projections.", link: "/learn/lines/5" },
    "6": { name: "Line 6 - Role Model", description: "Wisdom through three life phases. Role model maturing from experimentation to withdrawal to living example.", link: "/learn/lines/6" }
};

// Add planets
TOOLTIPS.planets = {
    personality: {
        "Sun": { name: "Personality Sun", description: "Your conscious life purpose and self-aware expression - 70% of energy. 'This is what I light up' - how you consciously shine.", link: "/learn/planets/personality-sun" },
        "Earth": { name: "Personality Earth", description: "Your conscious grounding force anchoring purpose. How you knowingly stabilize and what you consciously rely on.", link: "/learn/planets/personality-earth" },
        "Rahu": { name: "Personality North Node", description: "Your conscious life direction and aware future trajectory. Where you know you're headed, especially post-40.", link: "/learn/planets/personality-rahu" },
        "Ketu": { name: "Personality South Node", description: "Your conscious connection to past patterns. What you're aware you bring forward from history.", link: "/learn/planets/personality-ketu" },
        "Moon": { name: "Personality Moon", description: "Your conscious communication style. How you think about articulating thoughts and expressing mentally.", link: "/learn/planets/personality-moon" },
        "Mercury": { name: "Personality Mercury", description: "Your conscious mental processing. How you know you think and recognize your communication patterns.", link: "/learn/planets/personality-mercury" },
        "Venus": { name: "Personality Venus", description: "Your conscious values and what you know you love. Recognized relationship patterns and attractions.", link: "/learn/planets/personality-venus" },
        "Mars": { name: "Personality Mars", description: "Your conscious drive and recognized immature patterns. Mental awareness of impulsiveness and raw energy.", link: "/learn/planets/personality-mars" },
        "Jupiter": { name: "Personality Jupiter", description: "Your conscious blessings and where you know expansion happens. Recognized growth and opportunities.", link: "/learn/planets/personality-jupiter" },
        "Saturn": { name: "Personality Saturn", description: "Your conscious lessons and known discipline. Aware life teacher showing recognized challenges.", link: "/learn/planets/personality-saturn" },
        "Uranus": { name: "Personality Uranus", description: "Your conscious uniqueness and aware revolutionary spirit. Known individuality and recognized difference.", link: "/learn/planets/personality-uranus" },
        "Neptune": { name: "Personality Neptune", description: "Your conscious spiritual themes. Aware mysticism and recognized transcendent qualities.", link: "/learn/planets/personality-neptune" },
        "Pluto": { name: "Personality Pluto", description: "Your conscious transformation. Aware deep change and known generational themes you identify with.", link: "/learn/planets/personality-pluto" }
    },
    design: {
        "Sun": { name: "Design Sun", description: "Your unconscious genetic blueprint - 70% of energy you don't recognize. 'The warmth I radiate' - others see this.", link: "/learn/planets/design-sun" },
        "Earth": { name: "Design Earth", description: "Your unconscious grounding in form. Hidden foundation stabilizing vehicle without awareness.", link: "/learn/planets/design-earth" },
        "Rahu": { name: "Design North Node", description: "Your unconscious trajectory. Where your body is heading beneath awareness automatically.", link: "/learn/planets/design-rahu" },
        "Ketu": { name: "Design South Node", description: "Your unconscious karmic gifts in form. Hidden talents operating automatically through lineage.", link: "/learn/planets/design-ketu" },
        "Moon": { name: "Design Moon", description: "Your unconscious communication in vehicle. Physical driving patterns others see without your awareness.", link: "/learn/planets/design-moon" },
        "Mercury": { name: "Design Mercury", description: "Your unconscious mental processing. How body thinks beneath awareness - others see this style.", link: "/learn/planets/design-mercury" },
        "Venus": { name: "Design Venus", description: "Your unconscious values and hidden magnetism. What attracts to form beneath awareness.", link: "/learn/planets/design-venus" },
        "Mars": { name: "Design Mars", description: "Your unconscious body temperature and spinal heat. Physical intensity others feel you don't recognize.", link: "/learn/planets/design-mars" },
        "Jupiter": { name: "Design Jupiter", description: "Your unconscious blessings in form. Where rewards come to vehicle unexpectedly.", link: "/learn/planets/design-jupiter" },
        "Saturn": { name: "Design Saturn", description: "Your unconscious lessons in body. Challenges working through form beneath awareness.", link: "/learn/planets/design-saturn" },
        "Uranus": { name: "Design Uranus", description: "Your unconscious uniqueness radiating from vehicle. Revolutionary energy others notice.", link: "/learn/planets/design-uranus" },
        "Neptune": { name: "Design Neptune", description: "Your unconscious spiritual connection in form. Mystical qualities operating beneath awareness.", link: "/learn/planets/design-neptune" },
        "Pluto": { name: "Design Pluto", description: "Your unconscious transformation in body. Deep evolutionary force beneath surface awareness.", link: "/learn/planets/design-pluto" }
    }
};

// Add houses
TOOLTIPS.houses = {
    "1": { name: "1st House - Self & Identity", description: "Self, Identity & First Impressions - The mask you wear, physical appearance, how you approach life", link: "/learn/houses/1" },
    "2": { name: "2nd House - Values & Resources", description: "Money, Values & Possessions - Material resources, self-worth, what you value and attract", link: "/learn/houses/2" },
    "3": { name: "3rd House - Communication", description: "Communication & Learning - Siblings, neighbors, short trips, daily communication, early education", link: "/learn/houses/3" },
    "4": { name: "4th House - Home & Family", description: "Home & Family - Roots, ancestry, emotional foundation, private life, mother/nurturing parent", link: "/learn/houses/4" },
    "5": { name: "5th House - Creativity & Pleasure", description: "Creativity & Pleasure - Romance, children, creative expression, fun, speculation, joy", link: "/learn/houses/5" },
    "6": { name: "6th House - Health & Service", description: "Health & Service - Daily routines, work, health habits, service to others, pets", link: "/learn/houses/6" },
    "7": { name: "7th House - Partnerships", description: "Partnerships & Marriage - One-on-one relationships, marriage, business partners, open enemies", link: "/learn/houses/7" },
    "8": { name: "8th House - Transformation", description: "Transformation & Shared Resources - Death/rebirth, sexuality, shared money, inheritance, deep transformation", link: "/learn/houses/8" },
    "9": { name: "9th House - Philosophy & Travel", description: "Philosophy & Travel - Higher learning, philosophy, long-distance travel, religion, publishing", link: "/learn/houses/9" },
    "10": { name: "10th House - Career & Public Image", description: "Career & Public Image - Career, reputation, achievements, father/authority figures, public life", link: "/learn/houses/10" },
    "11": { name: "11th House - Friends & Community", description: "Friends & Community - Friendships, groups, hopes, wishes, humanitarian causes, social networks", link: "/learn/houses/11" },
    "12": { name: "12th House - Spirituality", description: "Spirituality & Hidden Matters - Subconscious, secrets, isolation, spirituality, hidden enemies, karma", link: "/learn/houses/12" }
};

module.exports = {
    TOOLTIPS
};
