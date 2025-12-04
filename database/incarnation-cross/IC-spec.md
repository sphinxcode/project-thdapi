# Incarnation Crosses Specification Document

## Overview

This document provides a comprehensive specification for all 192 Human Design Incarnation Crosses, including their structure, calculation logic, data format, and integration guidelines.

## Table of Contents

1. [Introduction](#introduction)
2. [Cross Types](#cross-types)
3. [Calculation Logic](#calculation-logic)
4. [Data Structure](#data-structure)
5. [Complete Cross List](#complete-cross-list)
6. [Integration Guidelines](#integration-guidelines)
7. [API Reference](#api-reference)
8. [Resources](#resources)

---

## Introduction

The Incarnation Cross represents approximately 70% of a person's energetic imprint in Human Design and defines their life's purpose and direction. There are **192 unique incarnation crosses** derived from combinations of four gates:

- **Personality Sun** (Conscious Sun) - Right column, top
- **Personality Earth** (Conscious Earth) - Right column, second
- **Design Sun** (Unconscious Sun) - Left column, top
- **Design Earth** (Unconscious Earth) - Left column, second

### Notation Format

Crosses are notated as: `Cross Name (PersS/PersE | DesS/DesE)`

Example: `Right Angle Cross of The Sphinx (13/7 | 1/2)`
- Personality Sun: Gate 13
- Personality Earth: Gate 7
- Design Sun: Gate 1
- Design Earth: Gate 2

---

## Cross Types

### 1. Right Angle Cross (RAC)
- **Count**: 88 variations (22 unique names × 4 quarters)
- **Meaning**: Personal Destiny
- **Energy**: Self-absorbed, personal journey
- **Characteristics**: These individuals are on a personal path of discovery. Their journey is about themselves, though it inadvertently serves as inspiration for others.

### 2. Juxtaposition Cross (JXT)
- **Count**: 64 variations (64 unique names × 1 appearance each)
- **Meaning**: Fixed Fate
- **Energy**: Bridge between personal and transpersonal
- **Characteristics**: A singular, focused purpose. These individuals have a specific destiny that is neither fully personal nor transpersonal.

### 3. Left Angle Cross (LAC)
- **Count**: 40 variations (20 unique names × 2 quarters)
- **Meaning**: Transpersonal Destiny
- **Energy**: Karma, relationships, collective evolution
- **Characteristics**: Their journey is intertwined with others. Growth comes through relationships and interactions.

**Total**: 88 + 64 + 40 = 192 incarnation crosses

---

## Calculation Logic

### Determining Cross Type

The type of incarnation cross is determined by the **line numbers** of the Personality Sun and Design Sun:

```javascript
function getCrossType(personalitySunLine, designSunLine) {
  if (personalitySunLine < 5 && designSunLine >= 3) {
    return 'Right Angle';
  } else if (personalitySunLine >= 5 && designSunLine < 3) {
    return 'Juxtaposition';
  } else if (personalitySunLine >= 5 && designSunLine >= 3) {
    return 'Left Angle';
  } else if (personalitySunLine < 5 && designSunLine < 3) {
    return 'Right Angle'; // Lines 1-4 on both sides
  }
}
```

### Line Distribution
- **Lines 1-4**: Right Angle territory (when both or personality is 1-4)
- **Lines 5-6**: Transpersonal territory (when on personality side)
- **Lines 3-6**: Left Angle on design side

### Profile Impact

The incarnation cross also varies by **profile** (the combination of personality and design lines). Each cross can have descriptions for profiles like:
- 1/3, 1/4
- 2/4, 2/5
- 3/5, 3/6
- 4/6, 4/1
- 5/1, 5/2
- 6/2, 6/3

---

## Data Structure

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Incarnation Crosses Database",
  "type": "object",
  "properties": {
    "rightAngleCrosses": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "type": { "enum": ["Right Angle"] },
          "variations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "personalitySun": { "type": "number", "minimum": 1, "maximum": 64 },
                "personalityEarth": { "type": "number", "minimum": 1, "maximum": 64 },
                "designSun": { "type": "number", "minimum": 1, "maximum": 64 },
                "designEarth": { "type": "number", "minimum": 1, "maximum": 64 },
                "quarter": { "type": "number", "minimum": 1, "maximum": 4 }
              },
              "required": ["personalitySun", "personalityEarth", "designSun", "designEarth"]
            }
          },
          "description": { "type": "string" },
          "profileDescriptions": {
            "type": "object",
            "patternProperties": {
              "^[1-6]/[1-6]$": { "type": "string" }
            }
          },
          "keywords": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["name", "type", "variations", "description"]
      }
    },
    "juxtapositionCrosses": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "type": { "enum": ["Juxtaposition"] },
          "gates": {
            "type": "object",
            "properties": {
              "personalitySun": { "type": "number" },
              "personalityEarth": { "type": "number" },
              "designSun": { "type": "number" },
              "designEarth": { "type": "number" }
            }
          },
          "description": { "type": "string" },
          "keywords": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "leftAngleCrosses": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "type": { "enum": ["Left Angle"] },
          "variations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "personalitySun": { "type": "number" },
                "personalityEarth": { "type": "number" },
                "designSun": { "type": "number" },
                "designEarth": { "type": "number" }
              }
            }
          },
          "description": { "type": "string" },
          "keywords": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  }
}
```

### TypeScript Interface

```typescript
export interface IncarnationCrossGates {
  personalitySun: number;
  personalityEarth: number;
  designSun: number;
  designEarth: number;
}

export interface IncarnationCross {
  name: string;
  type: 'Right Angle' | 'Juxtaposition' | 'Left Angle';
  gates: IncarnationCrossGates;
  description: string;
  profileDescriptions?: Record<string, string>;
  keywords?: string[];
  quarter?: 1 | 2 | 3 | 4; // For Right Angle and some Left Angle crosses
}

export interface IncarnationCrossesDatabase {
  rightAngleCrosses: Record<string, IncarnationCross>;
  juxtapositionCrosses: Record<string, IncarnationCross>;
  leftAngleCrosses: Record<string, IncarnationCross>;
}
```

---

## Complete Cross List

### Right Angle Crosses (88 variations / 22 unique names)

Each Right Angle Cross appears 4 times throughout the year (one per quarter). The gates remain thematic but rotate positions.

#### 1. Right Angle Cross of The Sphinx
**Theme**: Seeking truth, questioning, mystery

**Variations**:
1. (13/7 | 1/2) - Quarter of Initiation
2. (1/2 | 7/13) - Quarter of Civilization
3. (7/13 | 2/1) - Quarter of Duality
4. (2/1 | 13/7) - Quarter of Mutation

**Description**: These individuals possess deep curiosity and desire to uncover the unknown. They are drawn to mysteries, asking challenging questions, and seeking hidden truths. They should balance their search for knowledge with appreciation for life's unexplained mysteries.

**Keywords**: curiosity, investigation, truth-seeking, mystery

---

#### 2. Right Angle Cross of The Vessel of Love
**Variations**:
1. (25/46 | 10/15) - Quarter of Initiation
2. (10/15 | 46/25) - Quarter of Civilization
3. (46/25 | 15/10) - Quarter of Duality
4. (15/10 | 25/46) - Quarter of Mutation

**Description**: Profoundly empathetic and nurturing with deep capacity for love and compassion. Natural caregivers, healers, counselors, or teachers. Their journey is about learning to channel their intense capacity for love in a balanced, sustainable way while making a significant positive impact.

**Keywords**: love, compassion, caregiving, healing, empathy

---

#### 3. Right Angle Cross of The Sleeping Phoenix
**Variations**:
1. (20/34 | 55/59) - Quarter of Duality
2. (34/20 | 59/55) - Quarter of Mutation
3. (55/59 | 34/20) - Quarter of Initiation
4. (59/55 | 20/34) - Quarter of Civilization

**Description**: Possess transformative energy that can lie dormant until the right circumstances arise. Life journeys involve significant events or turning points that awaken their potential, enabling them to inspire and lead others. Must recognize their inherent power and use it responsibly for positive change.

**Keywords**: transformation, awakening, leadership, potential

---

#### 4. Right Angle Cross of Laws
**Variations**:
1. (3/50 | 60/56) - Quarter of Initiation
2. (60/56 | 50/3) - Quarter of Civilization
3. (50/3 | 56/60) - Quarter of Duality
4. (56/60 | 3/50) - Quarter of Mutation

**Description**: Strong sense of order and regulation. Naturally inclined toward understanding and creating systems, laws, or rules. Excel in environments governed by rules and may be adept at creating these structures. Must ensure structures support growth and innovation rather than limiting them.

**Keywords**: order, structure, systems, rules, organization

---

#### 5. Right Angle Cross of Explanation
**Variations**:
1. (49/4 | 43/23) - Quarter of Mutation
2. (4/49 | 23/43) - Quarter of Initiation
3. (23/43 | 49/4) - Quarter of Civilization
4. (43/23 | 4/49) - Quarter of Duality

**Description**: Inherent ability to articulate complex ideas in simplified, understandable manner. Natural talent for making connections between seemingly unrelated concepts and effectively conveying these connections. Skilled at teaching and explaining intricate concepts while maintaining accuracy and clarity.

**Keywords**: communication, teaching, clarity, analysis

---

#### 6. Right Angle Cross of The Four Ways
**Variations**:
1. (24/44 | 19/33) - Quarter of Initiation
2. (44/24 | 33/19) - Quarter of Civilization
3. (33/19 | 24/44) - Quarter of Duality
4. (19/33 | 44/24) - Quarter of Mutation

**Description**: Ability to see things from multiple perspectives. Adaptable thinkers capable of shifting viewpoint to better understand different situations or ideas. Should use this ability to foster understanding and empathy rather than to confuse or mislead.

**Keywords**: perspective, adaptability, understanding, flexibility

---

#### 7. Right Angle Cross of Planning
**Variations**:
1. (40/37 | 16/9) - Quarter of Duality
2. (37/40 | 9/16) - Quarter of Mutation
3. (16/9 | 37/40) - Quarter of Initiation
4. (9/16 | 40/37) - Quarter of Civilization

**Description**: Natural aptitude for strategic planning and organization. Excel in long-term thinking, carefully crafting plans and strategies for the future. Big-picture thinkers who foresee potential outcomes. Must balance planning with flexibility and adaptability to changing circumstances.

**Keywords**: strategy, planning, foresight, organization

---

#### 8. Right Angle Cross of Rulership
**Variations**:
1. (47/22 | 45/26) - Quarter of Mutation
2. (22/47 | 26/45) - Quarter of Initiation
3. (26/45 | 47/22) - Quarter of Civilization
4. (45/26 | 22/47) - Quarter of Duality

**Description**: Natural leadership abilities with knack for stepping into roles of authority and influence. Understanding of systems and structures enables effective governance. Must use power ethically and responsibly, leading with fairness, integrity, and justice.

**Keywords**: leadership, authority, governance, justice

---

#### 9. Right Angle Cross of Service
**Variations**:
1. (17/18 | 58/52) - Quarter of Civilization
2. (18/17 | 52/58) - Quarter of Duality
3. (52/58 | 17/18) - Quarter of Mutation
4. (58/52 | 18/17) - Quarter of Initiation

**Description**: Natural call to serve others. Find fulfillment in helping and supporting people, possibly drawn to healthcare, social work, or education. While service is noble, must ensure self-care and avoid burnout while balancing desire to serve with personal well-being.

**Keywords**: service, support, helping, caregiving

---

#### 10. Right Angle Cross of Maya
**Variations**:
1. (62/61 | 42/32) - Quarter of Mutation
2. (61/62 | 32/42) - Quarter of Initiation
3. (42/32 | 61/62) - Quarter of Civilization
4. (32/42 | 62/61) - Quarter of Duality

**Description**: Knack for understanding intricacies of the world. Excel in analyzing or creating complex systems. Talented at detailed analysis and system design. Must balance detail-oriented approach with awareness of broader contexts and perspectives while not losing sight of bigger picture.

**Keywords**: detail, analysis, systems, complexity

---

#### 11. Right Angle Cross of Penetration
**Variations**:
1. (53/54 | 51/57) - Quarter of Initiation
2. (54/53 | 57/51) - Quarter of Civilization
3. (51/57 | 54/53) - Quarter of Duality
4. (57/51 | 53/54) - Quarter of Mutation

**Description**: Natural ability to get to the heart of matters. Insightful and perceptive, often seeing things others overlook. Can cut through surface appearances to understand deeper realities. Must use penetrative insight wisely, kindly, and considerately, avoiding manipulation or controlling behavior.

**Keywords**: insight, perception, depth, understanding

---

#### 12. Right Angle Cross of Consciousness
**Variations**:
1. (63/64 | 5/35) - Quarter of Mutation
2. (5/35 | 63/64) - Quarter of Initiation
3. (64/63 | 35/5) - Quarter of Civilization
4. (35/5 | 64/63) - Quarter of Duality

**Description**: Highly conscious with strong drive to understand themselves and the world. Drawn to introspection, personal development, and exploration of consciousness. Natural ability for deep understanding and awareness, tapping into universal consciousness. Should use this understanding to guide life path through conscious, deliberate choices.

**Keywords**: awareness, consciousness, understanding, introspection

---

#### 13. Right Angle Cross of Eden
**Variations**:
1. (12/11 | 36/6) - Quarter of Civilization
2. (11/12 | 6/36) - Quarter of Duality
3. (36/6 | 11/12) - Quarter of Mutation
4. (6/36 | 12/11) - Quarter of Initiation

**Description**: Deeply connected with concepts of paradise, harmony, and idealistic perfection. Strive to create personal Eden in life, whether in relationships, work, or lifestyle. Drive to uncover "truth" of environments with strong desire to share findings for betterment of others. Must learn to share insights while respecting others' realities and perspectives.

**Keywords**: harmony, perfection, truth, paradise

---

#### 14. Right Angle Cross of Contagion
**Variations**:
1. (14/8 | 29/30) - Quarter of Initiation
2. (8/14 | 30/29) - Quarter of Civilization
3. (29/30 | 8/14) - Quarter of Duality
4. (30/29 | 14/8) - Quarter of Mutation

**Description**: Powerful influence on surroundings that can be almost infectious or viral in nature. Capacity to inspire, motivate, or deeply affect others. Ideas and behaviors can easily spread to those around them. Life path involves learning to use influence responsibly and for positive outcomes, ensuring impact benefits collective.

**Keywords**: influence, inspiration, contagion, impact

---

#### 15. Right Angle Cross of The Unexpected
**Variations**:
1. (27/28 | 41/31) - Quarter of Duality
2. (28/27 | 31/41) - Quarter of Mutation
3. (31/41 | 27/28) - Quarter of Initiation
4. (41/31 | 28/27) - Quarter of Civilization

**Description**: Often find themselves in unexpected or unpredictable circumstances. Knack for dealing with sudden changes or surprises. Innovative, adaptable, and capable of making most out of any situation. Life characterized by numerous sudden changes; journey about navigating changes with grace and resilience.

**Keywords**: adaptability, change, innovation, surprise

---

#### 16. Right Angle Cross of Tension
**Variations**:
1. (21/48 | 38/39) - Quarter of Civilization
2. (48/21 | 39/38) - Quarter of Duality
3. (38/39 | 48/21) - Quarter of Mutation
4. (39/38 | 21/48) - Quarter of Initiation

**Description**: Often in situations involving tension or conflict. Strong ability to manage stress, understand complex dynamics, and facilitate resolutions. Designed to thrive in challenging situations, using tension to stimulate progress and change. Path involves learning to navigate and mitigate tense situations effectively, creating harmony and resolution.

**Keywords**: tension, conflict resolution, stress management, transformation

---

#### 17-22. Additional Right Angle Crosses
*(Based on existing markdown data, there are additional crosses. The complete list would include all gate combinations following the pattern above.)*

---

### Juxtaposition Crosses (64 variations)

Each Juxtaposition Cross has a unique name and appears only once. These are the "fixed fate" crosses.

#### JXT-1. Juxtaposition Cross of Beginnings (53/54 | 42/32)
Embodies energy of new beginnings and initiations. Often initiators of new projects and enterprises, driving progress and growth. Bring about transformation but must manage impatience, ensuring processes have necessary time to mature.

**Keywords**: initiation, new beginnings, transformation, patience

---

#### JXT-2. Juxtaposition Cross of Bargains (37/40 | 5/35)
Born negotiators and dealmakers. Inherently understand principle of give and take, making them adept at creating mutually beneficial situations. Must ensure not overcompromising own needs in process.

**Keywords**: negotiation, dealmaking, balance, compromise

---

#### JXT-3. Juxtaposition Cross of Caring (27/28 | 19/33)
Deep drive to care for others. Often found in nurturing roles, capable of immense self-sacrifice for those they care about. Must remember to care for themselves and set healthy boundaries to prevent exhaustion.

**Keywords**: nurturing, caring, self-sacrifice, boundaries

---

#### JXT-4. Juxtaposition Cross of Behavior (10/15 | 18/17)
Profound understanding of human behavior. Natural observers who can read people exceptionally well. Must take care not to over-analyze or become overly critical, focusing instead on understanding and acceptance.

**Keywords**: observation, behavior analysis, understanding, acceptance

---

#### JXT-5. Juxtaposition Cross of Ambition (54/53 | 32/42)
Embodies ambition and drive for success. Often highly motivated and set big goals. Must learn to balance ambition with realism and patience to avoid burnout.

**Keywords**: ambition, success, motivation, balance

---

#### JXT-6. Juxtaposition Cross of Alertness (44/24 | 7/13)
Natural alertness to surroundings. Quick to notice changes and details others may miss. Skill beneficial in careers like journalism, investigation, or research.

**Keywords**: alertness, awareness, attention to detail, investigation

---

#### JXT-7. Juxtaposition Cross of Assimilation (23/43 | 30/29)
Ability to understand and assimilate complex information. Often possess unique perspective, allowing connections others cannot make. Must communicate ideas effectively to avoid misunderstanding.

**Keywords**: assimilation, complexity, unique perspective, communication

---

#### JXT-8. Juxtaposition Cross of Articulation (12/11 | 25/46)
Gift for articulation. Able to express thoughts, feelings, and concepts clearly and effectively, making excellent communicators and writers. Must be aware of power of words and use them responsibly.

**Keywords**: articulation, communication, expression, responsibility

---

#### JXT-9. Juxtaposition Cross of Completion (42/32 | 60/56)
Dedicated to seeing things through to completion. Value persistence and follow-through, excelling in roles requiring attention to detail. Must balance desire for completion with understanding that change is inherent part of life.

**Keywords**: completion, persistence, detail-oriented, adaptability

---

#### JXT-10. Juxtaposition Cross of Commitment (29/30 | 20/34)
All about commitment. Dedicated and steadfast, capable of great loyalty. Must ensure committing to right things and not stubbornly clinging to situations that no longer serve them.

**Keywords**: commitment, loyalty, dedication, discernment

---

#### JXT-11-64. Additional Juxtaposition Crosses
*(The complete database would include all 64 unique Juxtaposition crosses with their gate combinations and descriptions based on the existing markdown data.)*

---

### Left Angle Crosses (40 variations / 20 unique names)

Each Left Angle Cross appears twice (in different quarters). These represent transpersonal destiny.

#### LAC-1. Left Angle Cross of The Alpha
**Variations**:
1. (41/31 | 44/24) - First appearance
2. (31/41 | 24/44) - Second appearance

**Description**: Natural leaders with strong sense of direction and capacity to inspire others. Deep desire to pioneer new paths. Strong decision-making abilities and can intuit what needs to happen next. Must use leadership skills responsibly, considering implications of decisions and leading with empathy.

**Keywords**: leadership, pioneering, inspiration, responsibility

---

#### LAC-2. Left Angle Cross of Alignment
**Variations**:
1. (28/27 | 33/19) - First appearance
2. (27/28 | 19/33) - Second appearance

**Description**: Unique ability to align themselves with true path. Often in tune with inner compass, guiding them toward destiny. Drive to align self and others with core values and principles. Can help others find their path and stay true to it. Must respect individual journeys and not impose own values on others.

**Keywords**: alignment, values, guidance, respect

---

#### LAC-3. Left Angle Cross of The Clarion
**Variations**:
1. (57/51 | 62/61) - First appearance
2. (51/57 | 61/62) - Second appearance

**Description**: Calling to awaken others. Unique ability to alert others to important truths. Should use ability responsibly, conveying messages with respect for others' autonomy. May be more introspective in process of spreading awareness.

**Keywords**: awakening, truth, alertness, respect

---

#### LAC-4. Left Angle Cross of Cycles
**Variations**:
1. (53/54 | 42/32) - First appearance
2. (54/53 | 32/42) - Second appearance

**Description**: Naturally attuned to cycles of life, can anticipate and adapt to change effectively. Keen understanding of beginnings, developments, and conclusions. Can guide others through these cycles, providing wisdom and support through transitions and growth periods.

**Keywords**: cycles, change, wisdom, adaptation

---

#### LAC-5. Left Angle Cross of Confrontation
**Variations**:
1. (45/26 | 36/6) - First appearance
2. (26/45 | 6/36) - Second appearance

**Description**: Not afraid to face challenges head-on. Natural ability to confront and resolve conflicts, whether personal or professional. May be proactive in seeking opportunities for growth and improvement. Must balance assertiveness with empathy, ensuring fairness and consideration.

**Keywords**: confrontation, courage, resolution, fairness

---

#### LAC-6. Left Angle Cross of Defiance
**Variations**:
1. (2/1 | 49/4) - First appearance
2. (1/2 | 4/49) - Second appearance

**Description**: Strong spirit of defiance and desire to challenge status quo. Often independent thinkers who question established norms and seek innovative solutions. Defiance can be powerful force for change. May place more emphasis on self-discovery and personal development, driven by desire to live authentically in defiance of societal expectations.

**Keywords**: defiance, independence, innovation, authenticity

---

#### LAC-7-20. Additional Left Angle Crosses
*(The complete database would include all 20 unique Left Angle crosses with their variations based on the existing markdown data.)*

---

## Integration Guidelines

### For Website Implementation

#### 1. Database Setup

Create a JSON file: `/website/src/data/incarnation-crosses.json`

```json
{
  "rightAngleCrosses": { ... },
  "juxtapositionCrosses": { ... },
  "leftAngleCrosses": { ... }
}
```

#### 2. Calculation Function

Update `/website/src/app/api/calculate/route.ts`:

```typescript
import incarnationCrossesData from '@/data/incarnation-crosses.json';

interface GateActivation {
  gate: number;
  line: number;
  planet: string;
}

interface IncarnationCrossResult {
  name: string;
  type: 'Right Angle' | 'Juxtaposition' | 'Left Angle';
  gates: {
    personalitySun: number;
    personalityEarth: number;
    designSun: number;
    designEarth: number;
  };
  description: string;
  profile?: string;
  profileDescription?: string;
}

function calculateIncarnationCross(
  personalitySun: GateActivation,
  personalityEarth: GateActivation,
  designSun: GateActivation,
  designEarth: GateActivation
): IncarnationCrossResult {
  const psLine = personalitySun.line;
  const dsLine = designSun.line;

  const gates = {
    personalitySun: personalitySun.gate,
    personalityEarth: personalityEarth.gate,
    designSun: designSun.gate,
    designEarth: designEarth.gate
  };

  // Determine cross type based on lines
  let crossType: 'Right Angle' | 'Juxtaposition' | 'Left Angle';

  if (psLine >= 5 && dsLine >= 3) {
    crossType = 'Left Angle';
  } else if (psLine >= 5 && dsLine < 3) {
    crossType = 'Juxtaposition';
  } else {
    crossType = 'Right Angle';
  }

  // Look up cross in database
  const cross = findCrossInDatabase(gates, crossType);

  // Get profile-specific description if available
  const profile = `${psLine}/${dsLine}`;
  const profileDesc = cross.profileDescriptions?.[profile];

  return {
    name: cross.name,
    type: crossType,
    gates,
    description: cross.description,
    profile,
    profileDescription: profileDesc
  };
}

function findCrossInDatabase(
  gates: IncarnationCrossGates,
  type: string
): IncarnationCross {
  const databases = {
    'Right Angle': incarnationCrossesData.rightAngleCrosses,
    'Juxtaposition': incarnationCrossesData.juxtapositionCrosses,
    'Left Angle': incarnationCrossesData.leftAngleCrosses
  };

  const db = databases[type];

  // Search for matching gate combination
  for (const [key, cross] of Object.entries(db)) {
    if (cross.variations) {
      // Right Angle or Left Angle with variations
      for (const variation of cross.variations) {
        if (matchesGates(variation, gates)) {
          return { ...cross, gates: variation };
        }
      }
    } else if (matchesGates(cross.gates, gates)) {
      // Juxtaposition
      return cross;
    }
  }

  return getDefaultCross(gates, type);
}

function matchesGates(crossGates: any, gates: IncarnationCrossGates): boolean {
  return (
    crossGates.personalitySun === gates.personalitySun &&
    crossGates.personalityEarth === gates.personalityEarth &&
    crossGates.designSun === gates.designSun &&
    crossGates.designEarth === gates.designEarth
  );
}
```

#### 3. Frontend Display Component

Create `/website/src/components/IncarnationCrossCard.tsx`:

```typescript
import { IncarnationCrossResult } from '@/types/humandesign';

export default function IncarnationCrossCard({
  cross
}: {
  cross: IncarnationCrossResult
}) {
  return (
    <div className="incarnation-cross-card">
      <h2>{cross.name}</h2>
      <div className="cross-type-badge">
        {cross.type}
      </div>

      <div className="gate-display">
        <div className="personality-gates">
          <h3>Personality</h3>
          <p>Sun: Gate {cross.gates.personalitySun}</p>
          <p>Earth: Gate {cross.gates.personalityEarth}</p>
        </div>
        <div className="design-gates">
          <h3>Design</h3>
          <p>Sun: Gate {cross.gates.designSun}</p>
          <p>Earth: Gate {cross.gates.designEarth}</p>
        </div>
      </div>

      <div className="description">
        <p>{cross.description}</p>
      </div>

      {cross.profileDescription && (
        <div className="profile-description">
          <h3>For Profile {cross.profile}</h3>
          <p>{cross.profileDescription}</p>
        </div>
      )}
    </div>
  );
}
```

#### 4. Styling

Add to `/website/src/styles/incarnation-cross.css`:

```css
.incarnation-cross-card {
  padding: 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 2rem 0;
}

.cross-type-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 1rem 0;
}

.gate-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.description {
  line-height: 1.6;
  margin: 1.5rem 0;
}

.profile-description {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border-left: 4px solid rgba(255, 255, 255, 0.5);
}
```

---

## API Reference

### Endpoints

#### GET `/api/incarnation-crosses`
Returns all incarnation crosses data

**Response**:
```json
{
  "rightAngleCrosses": { ... },
  "juxtapositionCrosses": { ... },
  "leftAngleCrosses": { ... }
}
```

#### GET `/api/incarnation-crosses/:type/:name`
Returns specific cross by type and name

**Parameters**:
- `type`: "right-angle" | "juxtaposition" | "left-angle"
- `name`: URL-encoded cross name

**Response**:
```json
{
  "name": "Right Angle Cross of The Sphinx",
  "type": "Right Angle",
  "variations": [...],
  "description": "...",
  "profileDescriptions": {...}
}
```

#### POST `/api/calculate-cross`
Calculate incarnation cross from birth data

**Request Body**:
```json
{
  "personalitySun": { "gate": 13, "line": 3 },
  "personalityEarth": { "gate": 7, "line": 3 },
  "designSun": { "gate": 1, "line": 4 },
  "designEarth": { "gate": 2, "line": 4 }
}
```

**Response**:
```json
{
  "name": "Right Angle Cross of The Sphinx",
  "type": "Right Angle",
  "gates": {
    "personalitySun": 13,
    "personalityEarth": 7,
    "designSun": 1,
    "designEarth": 2
  },
  "description": "...",
  "profile": "3/4",
  "profileDescription": "..."
}
```

---

## Resources

### Research Sources

- [Incarnation Cross List](https://loveyourhumandesign.com/incarnation-crosses/)
- [Jovian Archive - Official Human Design Resource](https://www.jovianarchive.com/Human_Design/Incarnation_Cross)
- [Human Design Blueprint - Exploring Incarnation Crosses](https://humandesignblueprint.com/exploring-the-incarnation-cross-in-human-design/)
- [Pure Generators - Finding Your Incarnation Cross](https://www.puregenerators.com/blog/human-design-incarnation-cross)
- [Free Human Design Chart - Incarnation Cross Guide](https://freehumandesignchart.com/incarnation-cross/)

### Reference Books

- **"The Book of Destinies"** by Chetan Parkyn - Most comprehensive print resource on Incarnation Crosses
- **"Incarnation Crosses by Profile"** (4-volume set) - 1200+ pages from Jovian Archive covering all 192 crosses
  - Volume I: Quarter of Initiation
  - Volume II: Quarter of Civilization
  - Volume III: Quarter of Duality
  - Volume IV: Quarter of Mutation

### Tools & Libraries

- **hdkit** - Human Design calculation library
- **Swiss Ephemeris** - Astronomical calculations for precise planetary positions

---

## Next Steps

### Phase 1: Data Collection (Priority: HIGH)
1. ✅ Review existing markdown files for cross descriptions
2. ⏳ Extract all cross names and gate combinations
3. ⏳ Compile complete list of all 192 crosses
4. ⏳ Verify gate combinations for accuracy

### Phase 2: Database Creation (Priority: HIGH)
1. ⏳ Create JSON database file with all crosses
2. ⏳ Add descriptions from existing markdown
3. ⏳ Add profile-specific descriptions where available
4. ⏳ Add keywords and themes for each cross

### Phase 3: Integration (Priority: MEDIUM)
1. ⏳ Update calculation logic in `/website/src/app/api/calculate/route.ts`
2. ⏳ Create TypeScript interfaces
3. ⏳ Build frontend components
4. ⏳ Add styling

### Phase 4: Enhancement (Priority: LOW)
1. ⏳ Add cross comparison features
2. ⏳ Create cross search/filter functionality
3. ⏳ Add detailed quarter information
4. ⏳ Create educational content about crosses

---

## Maintenance

### Updating Cross Data

To add or update a cross:

1. Edit `/website/src/data/incarnation-crosses.json`
2. Follow the schema structure
3. Validate JSON syntax
4. Test calculation with sample data
5. Verify frontend display

### Quality Checks

- [ ] All 192 crosses present
- [ ] All gate combinations validated
- [ ] Descriptions complete and accurate
- [ ] Profile descriptions added where available
- [ ] Keywords relevant and helpful
- [ ] TypeScript types up to date

---

## License & Attribution

This specification document is part of the Human Design MCP project. All Human Design intellectual property belongs to Jovian Archive and Ra Uru Hu. This implementation is for educational and personal use purposes.

---

**Document Version**: 1.0
**Last Updated**: 2025-12-04
**Maintained By**: Human Design MCP Team
