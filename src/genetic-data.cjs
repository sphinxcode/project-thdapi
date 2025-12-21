/**
 * Genetic Data for Human Design
 * Includes: Amino Acids, Codons (Nucleic Acids), Exaltations/Detriments, Gate Names, and I Ching Glyphs
 */

// Import gate names and I Ching glyphs
const { GATE_NAMES, I_CHING_GLYPHS } = require('./gate-names-data.cjs');

// Import gate enrichment data
const { GATE_DESCRIPTIONS, HARMONIC_GATES, ELECTROMAGNETIC_GATES } = require('./gate-enrichment-data.cjs');

// Import gate-to-center mapping
const { GATE_TO_CENTER } = require('./gate-to-center-mapping.cjs');

// Amino Acids by Gate with Ring information
const aminoAcidByGate = {
  1: { name: 'Lysine', ring: 'The Ring of Fire', gates: [1, 14], oppositeGate: 2 },
  2: { name: 'Phenylalanine', ring: 'The Ring of Water', gates: [2, 8], oppositeGate: 1 },
  3: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 50 },
  4: { name: 'Valine', ring: 'The Ring of Union', gates: [4, 7, 29, 59], oppositeGate: 49 },
  5: { name: 'Threonine', ring: 'The Ring of Light', gates: [5, 9, 11, 26], oppositeGate: 35 },
  6: { name: 'Glycine', ring: 'The Ring of Alchemy', gates: [6, 40, 47, 64], oppositeGate: 36 },
  7: { name: 'Valine', ring: 'The Ring of Union', gates: [4, 7, 29, 59], oppositeGate: 13 },
  8: { name: 'Phenylalanine', ring: 'The Ring of Water', gates: [2, 8], oppositeGate: 14 },
  9: { name: 'Threonine', ring: 'The Ring of Light', gates: [5, 9, 11, 26], oppositeGate: 16 },
  10: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 15 },
  11: { name: 'Threonine', ring: 'The Ring of Light', gates: [5, 9, 11, 26], oppositeGate: 12 },
  12: { name: 'None (Terminator Codon)', ring: 'The Ring of Trials', gates: [12, 33, 56], oppositeGate: 11 },
  13: { name: 'Glutamine', ring: 'The Ring of Purification', gates: [13, 30], oppositeGate: 7 },
  14: { name: 'Lysine', ring: 'The Ring of Fire', gates: [1, 14], oppositeGate: 8 },
  15: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 10 },
  16: { name: 'Cysteine', ring: 'The Ring of Prosperity', gates: [16, 45], oppositeGate: 9 },
  17: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 18 },
  18: { name: 'Alanine', ring: 'The Ring of Matter', gates: [18, 46, 48, 57], oppositeGate: 17 },
  19: { name: 'Isoleucine', ring: 'The Ring of Gaia', gates: [19, 60, 61], oppositeGate: 33 },
  20: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 34 },
  21: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 48 },
  22: { name: 'Proline', ring: 'The Ring of Divinity', gates: [22, 36, 37, 63], oppositeGate: 47 },
  23: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 43 },
  24: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 44 },
  25: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 46 },
  26: { name: 'Threonine', ring: 'The Ring of Light', gates: [5, 9, 11, 26], oppositeGate: 45 },
  27: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 28 },
  28: { name: 'Asparaginic Acid', ring: 'The Ring of Illusion', gates: [28, 32], oppositeGate: 27 },
  29: { name: 'Valine', ring: 'The Ring of Union', gates: [4, 7, 29, 59], oppositeGate: 30 },
  30: { name: 'Glutamine', ring: 'The Ring of Purification', gates: [13, 30], oppositeGate: 29 },
  31: { name: 'Tyrosine', ring: 'The Ring of No Return', gates: [31, 62], oppositeGate: 41 },
  32: { name: 'Asparaginic Acid', ring: 'The Ring of Illusion', gates: [28, 32], oppositeGate: 42 },
  33: { name: 'None (Terminator Codon)', ring: 'The Ring of Trials', gates: [12, 33, 56], oppositeGate: 19 },
  34: { name: 'Asparganine', ring: 'The Ring of Destiny', gates: [34, 43], oppositeGate: 20 },
  35: { name: 'Tryptophan', ring: 'The Ring of Miracles', gates: [35], oppositeGate: 5 },
  36: { name: 'Proline', ring: 'The Ring of Divinity', gates: [22, 36, 37, 63], oppositeGate: 6 },
  37: { name: 'Proline', ring: 'The Ring of Divinity', gates: [22, 36, 37, 63], oppositeGate: 40 },
  38: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 39 },
  39: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 38 },
  40: { name: 'Glycine', ring: 'The Ring of Alchemy', gates: [6, 40, 47, 64], oppositeGate: 37 },
  41: { name: 'Methionine (Initiator)', ring: 'The Ring of Origin', gates: [41], oppositeGate: 31 },
  42: { name: 'Leucine', ring: 'The Ring of Life & Death', gates: [3, 20, 23, 24, 27, 42], oppositeGate: 32 },
  43: { name: 'Asparganine', ring: 'The Ring of Destiny', gates: [34, 43], oppositeGate: 23 },
  44: { name: 'Glutamic Acid', ring: 'The Ring of The Illuminati', gates: [44, 50], oppositeGate: 24 },
  45: { name: 'Cysteine', ring: 'The Ring of Prosperity', gates: [16, 45], oppositeGate: 26 },
  46: { name: 'Alanine', ring: 'The Ring of Matter', gates: [18, 46, 48, 57], oppositeGate: 25 },
  47: { name: 'Glycine', ring: 'The Ring of Alchemy', gates: [6, 40, 47, 64], oppositeGate: 22 },
  48: { name: 'Alanine', ring: 'The Ring of Matter', gates: [18, 46, 48, 57], oppositeGate: 21 },
  49: { name: 'Histidine', ring: 'The Ring of The Whirlwind', gates: [49, 55], oppositeGate: 4 },
  50: { name: 'Glutamic Acid', ring: 'The Ring of The Illuminati', gates: [44, 50], oppositeGate: 3 },
  51: { name: 'Arginine', ring: 'The Ring of Humanity', gates: [10, 17, 21, 25, 38, 51], oppositeGate: 57 },
  52: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 58 },
  53: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 54 },
  54: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 53 },
  55: { name: 'Histidine', ring: 'The Ring of The Whirlwind', gates: [49, 55], oppositeGate: 59 },
  56: { name: 'None (Terminator Codon)', ring: 'The Ring of Trials', gates: [12, 33, 56], oppositeGate: 60 },
  57: { name: 'Alanine', ring: 'The Ring of Matter', gates: [18, 46, 48, 57], oppositeGate: 51 },
  58: { name: 'Serine', ring: 'The Ring of Seeking', gates: [15, 39, 52, 53, 54, 58], oppositeGate: 52 },
  59: { name: 'Valine', ring: 'The Ring of Union', gates: [4, 7, 29, 59], oppositeGate: 55 },
  60: { name: 'Isoleucine', ring: 'The Ring of Gaia', gates: [19, 60, 61], oppositeGate: 56 },
  61: { name: 'Isoleucine', ring: 'The Ring of Gaia', gates: [19, 60, 61], oppositeGate: 62 },
  62: { name: 'Tyrosine', ring: 'The Ring of No Return', gates: [31, 62], oppositeGate: 61 },
  63: { name: 'Proline', ring: 'The Ring of Divinity', gates: [22, 36, 37, 63], oppositeGate: 64 },
  64: { name: 'Glycine', ring: 'The Ring of Alchemy', gates: [6, 40, 47, 64], oppositeGate: 63 }
};

// Codon (Nucleic Acid) Sequences by Gate
const codonByGate = {
  1: 'AAA', 2: 'UUU', 3: 'CAA', 4: 'UCA', 5: 'GUA', 6: 'UCU',
  7: 'GCA', 8: 'CUA', 9: 'GAA', 10: 'AAU', 11: 'AAC', 12: 'CUU',
  13: 'UGU', 14: 'AUG', 15: 'GGU', 16: 'UAA', 17: 'CUG', 18: 'GUG',
  19: 'CAU', 20: 'UCC', 21: 'UUC', 22: 'CCA', 23: 'CGA', 24: 'GCA',
  25: 'UAU', 26: 'AUC', 27: 'CCU', 28: 'CAA', 29: 'CUC', 30: 'GUC',
  31: 'GAG', 32: 'CCA', 33: 'AAU', 34: 'CAA', 35: 'GCU', 36: 'GGA',
  37: 'GAC', 38: 'CAC', 39: 'GCU', 40: 'GGA', 41: 'UAU', 42: 'CUA',
  43: 'CAU', 44: 'GCA', 45: 'AGU', 46: 'UGU', 47: 'GAC', 48: 'CUA',
  49: 'GUA', 50: 'CAU', 51: 'CGA', 52: 'GGA', 53: 'CAU', 54: 'UCA',
  55: 'CUA', 56: 'CGA', 57: 'GAU', 58: 'CCU', 59: 'GGA', 60: 'CAA',
  61: 'AGC', 62: 'AUA', 63: 'AUC', 64: 'AUG'
};

// Exaltations and Detriments by Gate.Line
const exaltationsDetriments = {
  '1.1': { exaltation: 'Moon', detriment: 'Uranus' },
  '1.2': { exaltation: 'Venus', detriment: 'Mars' },
  '1.3': { exaltation: 'Mars', detriment: 'Earth' },
  '1.4': { exaltation: 'Earth', detriment: 'Jupiter' },
  '1.5': { exaltation: 'Mars', detriment: 'Uranus' },
  '1.6': { exaltation: 'Earth', detriment: 'Pluto' },
  '2.1': { exaltation: 'Venus', detriment: 'Mars' },
  '2.2': { exaltation: 'Saturn', detriment: 'Mars' },
  '2.3': { exaltation: 'Jupiter', detriment: 'Uranus' },
  '2.4': { exaltation: 'Venus', detriment: 'Mars' },
  '2.5': { exaltation: 'Mercury', detriment: 'Earth' },
  '2.6': { exaltation: 'Mercury', detriment: 'Saturn' },
  '3.1': { exaltation: 'Earth', detriment: 'Mercury' },
  '3.2': { exaltation: 'Mars', detriment: 'Uranus' },
  '3.3': { exaltation: 'Venus', detriment: 'Pluto' },
  '3.4': { exaltation: 'Neptune', detriment: 'Mars' },
  '3.5': { exaltation: 'Mars', detriment: 'Earth' },
  '3.6': { exaltation: 'Sun', detriment: 'Pluto' },
  '4.1': { exaltation: 'Moon', detriment: 'Earth' },
  '4.2': { exaltation: 'Moon', detriment: 'Mars' },
  '4.3': { exaltation: 'Venus', detriment: 'Pluto' },
  '4.4': { exaltation: 'Sun', detriment: 'Saturn' },
  '4.5': { exaltation: 'Jupiter', detriment: 'Pluto' },
  '4.6': { exaltation: 'Mercury', detriment: 'Mars' },
  '5.1': { exaltation: 'Mars', detriment: 'Earth' },
  '5.2': { exaltation: 'Venus', detriment: 'Pluto' },
  '5.3': { exaltation: 'Neptune', detriment: 'Moon' },
  '5.4': { exaltation: 'Uranus', detriment: 'Sun' },
  '5.5': { exaltation: 'Venus', detriment: 'Pluto' },
  '5.6': { exaltation: 'Neptune', detriment: null },
  '6.1': { exaltation: 'Pluto', detriment: 'Mercury' },
  '6.2': { exaltation: 'Venus', detriment: 'Mars' },
  '6.3': { exaltation: 'Neptune', detriment: 'Pluto' },
  '6.4': { exaltation: 'Sun', detriment: 'Pluto' },
  '6.5': { exaltation: 'Venus', detriment: 'Moon' },
  '6.6': { exaltation: 'Mercury', detriment: 'Venus' },
  '7.1': { exaltation: 'Venus', detriment: 'Mercury' },
  '7.2': { exaltation: 'Neptune', detriment: 'Mercury' },
  '7.3': { exaltation: 'Moon', detriment: 'Mercury' },
  '7.4': { exaltation: 'Sun', detriment: 'Uranus' },
  '7.5': { exaltation: 'Venus', detriment: 'Neptune' },
  '7.6': { exaltation: 'Mercury', detriment: 'Uranus' },
  '8.1': { exaltation: 'Neptune', detriment: 'Mercury' },
  '8.2': { exaltation: 'Sun', detriment: 'Earth' },
  '8.3': { exaltation: 'Moon', detriment: 'Saturn' },
  '8.4': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '8.5': { exaltation: 'Jupiter', detriment: 'Sun' },
  '8.6': { exaltation: 'Venus', detriment: 'Pluto' },
  '9.1': { exaltation: 'Pluto', detriment: 'Mars' },
  '9.2': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '9.3': { exaltation: 'Earth', detriment: 'Sun' },
  '9.4': { exaltation: 'Moon', detriment: 'Mars' },
  '9.5': { exaltation: 'Jupiter', detriment: 'Earth' },
  '9.6': { exaltation: 'Moon', detriment: 'Pluto' },
  '10.1': { exaltation: 'Sun', detriment: 'Moon' },
  '10.2': { exaltation: 'Mercury', detriment: 'Mars' },
  '10.3': { exaltation: 'Earth', detriment: 'Moon' },
  '10.4': { exaltation: 'Uranus', detriment: 'Mercury' },
  '10.5': { exaltation: 'Jupiter', detriment: 'Mars' },
  '10.6': { exaltation: 'Pluto', detriment: 'Saturn' },
  '11.1': { exaltation: 'Moon', detriment: 'Mars' },
  '11.2': { exaltation: 'Neptune', detriment: 'Mars' },
  '11.3': { exaltation: 'Pluto', detriment: 'Venus' },
  '11.4': { exaltation: 'Moon', detriment: 'Sun' },
  '11.5': { exaltation: 'Moon', detriment: 'Mercury' },
  '11.6': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '12.1': { exaltation: 'Venus', detriment: 'Jupiter' },
  '12.2': { exaltation: 'Saturn', detriment: 'Mercury' },
  '12.3': { exaltation: 'Neptune', detriment: 'Mars' },
  '12.4': { exaltation: 'Earth', detriment: 'Mercury' },
  '12.5': { exaltation: 'Sun', detriment: 'Mars' },
  '12.6': { exaltation: 'Sun', detriment: 'Earth' },
  '13.1': { exaltation: 'Venus', detriment: 'Moon' },
  '13.2': { exaltation: 'Moon', detriment: 'Sun' },
  '13.3': { exaltation: 'Earth', detriment: 'Venus' },
  '13.4': { exaltation: 'Pluto', detriment: 'Venus' },
  '13.5': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '13.6': { exaltation: 'Mars', detriment: 'Mercury' },
  '14.1': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '14.2': { exaltation: 'Jupiter', detriment: 'Mars' },
  '14.3': { exaltation: 'Earth', detriment: 'Neptune' },
  '14.4': { exaltation: 'Moon', detriment: 'Mars' },
  '14.5': { exaltation: 'Sun', detriment: 'Venus' },
  '14.6': { exaltation: 'Sun', detriment: 'Earth' },
  '15.1': { exaltation: 'Venus', detriment: 'Mars' },
  '15.2': { exaltation: 'Sun', detriment: 'Earth' },
  '15.3': { exaltation: 'Earth', detriment: 'Mercury' },
  '15.4': { exaltation: 'Jupiter', detriment: 'Saturn' },
  '15.5': { exaltation: 'Jupiter', detriment: 'Pluto' },
  '15.6': { exaltation: 'Pluto', detriment: 'Venus' },
  '16.1': { exaltation: 'Earth', detriment: 'Mercury' },
  '16.2': { exaltation: 'Sun', detriment: 'Mercury' },
  '16.3': { exaltation: 'Moon', detriment: 'Mars' },
  '16.4': { exaltation: 'Jupiter', detriment: 'Mars' },
  '16.5': { exaltation: 'Pluto', detriment: 'Moon' },
  '16.6': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '17.1': { exaltation: 'Mars', detriment: 'Venus' },
  '17.2': { exaltation: 'Sun', detriment: 'Moon' },
  '17.3': { exaltation: 'Pluto', detriment: 'Earth' },
  '17.4': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '17.5': { exaltation: 'Uranus', detriment: 'Mars' },
  '17.6': { exaltation: 'Moon', detriment: 'Jupiter' },
  '18.1': { exaltation: 'Earth', detriment: 'Jupiter' },
  '18.2': { exaltation: 'Pluto', detriment: 'Moon' },
  '18.3': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '18.4': { exaltation: 'Earth', detriment: 'Mercury' },
  '18.5': { exaltation: 'Saturn', detriment: 'Uranus' },
  '18.6': { exaltation: 'Mars', detriment: 'Moon' },
  '19.1': { exaltation: 'Sun', detriment: 'Moon' },
  '19.2': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '19.3': { exaltation: 'Venus', detriment: 'Moon' },
  '19.4': { exaltation: 'Mars', detriment: 'Venus' },
  '19.5': { exaltation: 'Earth', detriment: 'Jupiter' },
  '19.6': { exaltation: 'Jupiter', detriment: 'Mars' },
  '20.1': { exaltation: 'Venus', detriment: 'Moon' },
  '20.2': { exaltation: 'Venus', detriment: 'Moon' },
  '20.3': { exaltation: 'Sun', detriment: 'Earth' },
  '20.4': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '20.5': { exaltation: 'Saturn', detriment: 'Uranus' },
  '20.6': { exaltation: 'Venus', detriment: 'Mercury' },
  '21.1': { exaltation: 'Mars', detriment: 'Moon' },
  '21.2': { exaltation: 'Mars', detriment: 'Neptune' },
  '21.3': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '21.4': { exaltation: 'Jupiter', detriment: 'Earth' },
  '21.5': { exaltation: 'Jupiter', detriment: 'Pluto' },
  '21.6': { exaltation: 'Pluto', detriment: 'Venus' },
  '22.1': { exaltation: 'Moon', detriment: 'Mars' },
  '22.2': { exaltation: 'Sun', detriment: 'Jupiter' },
  '22.3': { exaltation: 'Saturn', detriment: 'Mars' },
  '22.4': { exaltation: 'Neptune', detriment: 'Mars' },
  '22.5': { exaltation: 'Jupiter', detriment: 'Mars' },
  '22.6': { exaltation: 'Sun', detriment: 'Mars' },
  '23.1': { exaltation: 'Jupiter', detriment: 'Mars' },
  '23.2': { exaltation: 'Jupiter', detriment: 'Moon' },
  '23.3': { exaltation: 'Sun', detriment: 'Pluto' },
  '23.4': { exaltation: 'Sun', detriment: 'Earth' },
  '23.5': { exaltation: 'Jupiter', detriment: 'Moon' },
  '23.6': { exaltation: 'Mars', detriment: 'Jupiter' },
  '24.1': { exaltation: 'Sun', detriment: 'Pluto' },
  '24.2': { exaltation: 'Moon', detriment: 'Mars' },
  '24.3': { exaltation: 'Venus', detriment: 'Jupiter' },
  '24.4': { exaltation: 'Saturn', detriment: 'Neptune' },
  '24.5': { exaltation: 'Moon', detriment: 'Mars' },
  '24.6': { exaltation: 'Jupiter', detriment: 'Pluto' },
  '25.1': { exaltation: 'Neptune', detriment: 'Mercury' },
  '25.2': { exaltation: 'Mercury', detriment: 'Mars' },
  '25.3': { exaltation: 'Mars', detriment: 'Pluto' },
  '25.4': { exaltation: 'Venus', detriment: null },
  '25.5': { exaltation: 'Venus', detriment: 'Jupiter' },
  '25.6': { exaltation: 'Earth', detriment: 'Uranus' },
  '26.1': { exaltation: 'Neptune', detriment: 'Mars' },
  '26.2': { exaltation: 'Sun', detriment: 'Pluto' },
  '26.3': { exaltation: 'Sun', detriment: 'Saturn' },
  '26.4': { exaltation: 'Pluto', detriment: 'Saturn' },
  '26.5': { exaltation: 'Mars', detriment: 'Venus' },
  '26.6': { exaltation: 'Sun', detriment: 'Moon' },
  '27.1': { exaltation: 'Sun', detriment: 'Earth' },
  '27.2': { exaltation: 'Moon', detriment: 'Mars' },
  '27.3': { exaltation: 'Pluto', detriment: 'Mars' },
  '27.4': { exaltation: 'Jupiter', detriment: 'Mars' },
  '27.5': { exaltation: 'Jupiter', detriment: 'Saturn' },
  '27.6': { exaltation: 'Moon', detriment: 'Pluto' },
  '28.1': { exaltation: 'Mars', detriment: 'Venus' },
  '28.2': { exaltation: 'Sun', detriment: 'Jupiter' },
  '28.3': { exaltation: 'Saturn', detriment: 'Jupiter' },
  '28.4': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '28.5': { exaltation: 'Pluto', detriment: 'Sun' },
  '28.6': { exaltation: 'Pluto', detriment: 'Neptune' },
  '29.1': { exaltation: 'Mars', detriment: 'Neptune' },
  '29.2': { exaltation: 'Sun', detriment: 'Venus' },
  '29.3': { exaltation: 'Mars', detriment: 'Jupiter' },
  '29.4': { exaltation: 'Saturn', detriment: 'Venus' },
  '29.5': { exaltation: 'Sun', detriment: 'Earth' },
  '29.6': { exaltation: 'Mars', detriment: 'Jupiter' },
  '30.1': { exaltation: 'Sun', detriment: 'Jupiter' },
  '30.2': { exaltation: 'Sun', detriment: 'Mars' },
  '30.3': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '30.4': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '30.5': { exaltation: 'Jupiter', detriment: 'Pluto' },
  '30.6': { exaltation: 'Mars', detriment: 'Moon' },
  '31.1': { exaltation: 'Sun', detriment: 'Earth' },
  '31.2': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '31.3': { exaltation: 'Sun', detriment: 'Jupiter' },
  '31.4': { exaltation: 'Moon', detriment: 'Mars' },
  '31.5': { exaltation: 'Pluto', detriment: 'Moon' },
  '31.6': { exaltation: 'Sun', detriment: 'Moon' },
  '33.1': { exaltation: 'Sun', detriment: 'Mars' },
  '33.2': { exaltation: 'Jupiter', detriment: 'Neptune' },
  '33.3': { exaltation: 'Jupiter', detriment: 'Mars' },
  '33.4': { exaltation: 'Pluto', detriment: 'Neptune' },
  '33.5': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '33.6': { exaltation: 'Sun', detriment: 'Jupiter' },
  '34.1': { exaltation: 'Saturn', detriment: 'Pluto' },
  '34.2': { exaltation: 'Mars', detriment: 'Venus' },
  '34.3': { exaltation: 'Saturn', detriment: 'Mercury' },
  '34.4': { exaltation: 'Pluto', detriment: 'Mars' },
  '34.5': { exaltation: 'Mars', detriment: 'Moon' },
  '34.6': { exaltation: 'Earth', detriment: 'Jupiter' },
  '35.1': { exaltation: 'Venus', detriment: 'Neptune' },
  '35.2': { exaltation: 'Venus', detriment: 'Moon' },
  '35.3': { exaltation: 'Jupiter', detriment: 'Sun' },
  '35.4': { exaltation: 'Moon', detriment: 'Mars' },
  '35.5': { exaltation: 'Mercury', detriment: 'Jupiter' },
  '35.6': { exaltation: 'Saturn', detriment: 'Mars' },
  '36.1': { exaltation: 'Mars', detriment: 'Jupiter' },
  '36.2': { exaltation: 'Neptune', detriment: 'Moon' },
  '36.3': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '36.4': { exaltation: 'Pluto', detriment: 'Moon' },
  '36.5': { exaltation: 'Pluto', detriment: 'Mercury' },
  '36.6': { exaltation: 'Jupiter', detriment: 'Saturn' },
  '37.1': { exaltation: 'Venus', detriment: null },
  '37.2': { exaltation: 'Jupiter', detriment: 'Mercury' },
  '37.3': { exaltation: 'Jupiter', detriment: 'Mars' },
  '37.4': { exaltation: 'Moon', detriment: 'Saturn' },
  '37.5': { exaltation: 'Venus', detriment: 'Mars' },
  '37.6': { exaltation: 'Venus', detriment: 'Mercury' },
  '38.1': { exaltation: 'Neptune', detriment: 'Mars' },
  '38.2': { exaltation: 'Pluto', detriment: 'Moon' },
  '38.3': { exaltation: 'Sun', detriment: 'Earth' },
  '38.4': { exaltation: 'Pluto', detriment: 'Mars' },
  '38.5': { exaltation: 'Saturn', detriment: 'Pluto' },
  '38.6': { exaltation: 'Saturn', detriment: 'Earth' },
  '39.1': { exaltation: 'Mars', detriment: 'Mercury' },
  '39.2': { exaltation: 'Moon', detriment: 'Jupiter' },
  '39.3': { exaltation: 'Jupiter', detriment: 'Earth' },
  '39.4': { exaltation: 'Moon', detriment: 'Sun' },
  '39.5': { exaltation: 'Neptune', detriment: 'Mars' },
  '39.6': { exaltation: 'Moon', detriment: 'Mars' },
  '40.1': { exaltation: 'Sun', detriment: 'Moon' },
  '40.2': { exaltation: 'Sun', detriment: 'Moon' },
  '40.3': { exaltation: 'Pluto', detriment: 'Mars' },
  '40.4': { exaltation: 'Uranus', detriment: 'Mars' },
  '40.5': { exaltation: 'Uranus', detriment: 'Earth' },
  '40.6': { exaltation: 'Sun', detriment: 'Earth' },
  '41.1': { exaltation: 'Neptune', detriment: 'Mercury' },
  '41.2': { exaltation: 'Saturn', detriment: 'Mars' },
  '41.3': { exaltation: 'Saturn', detriment: 'Moon' },
  '41.4': { exaltation: 'Earth', detriment: 'Venus' },
  '41.5': { exaltation: 'Mars', detriment: 'Venus' },
  '41.6': { exaltation: 'Saturn', detriment: 'Pluto' },
  '42.1': { exaltation: 'Sun', detriment: 'Venus' },
  '42.2': { exaltation: 'Sun', detriment: 'Venus' },
  '42.3': { exaltation: 'Mars', detriment: 'Moon' },
  '42.4': { exaltation: 'Moon', detriment: 'Venus' },
  '42.5': { exaltation: 'Sun', detriment: 'Venus' },
  '42.6': { exaltation: 'Moon', detriment: 'Saturn' },
  '43.1': { exaltation: 'Pluto', detriment: 'Venus' },
  '43.2': { exaltation: 'Pluto', detriment: 'Moon' },
  '43.3': { exaltation: 'Pluto', detriment: 'Moon' },
  '43.4': { exaltation: 'Mercury', detriment: 'Jupiter' },
  '43.5': { exaltation: 'Moon', detriment: 'Venus' },
  '43.6': { exaltation: 'Sun', detriment: 'Mars' },
  '44.1': { exaltation: 'Pluto', detriment: 'Venus' },
  '44.2': { exaltation: 'Jupiter', detriment: 'Mars' },
  '44.3': { exaltation: 'Mars', detriment: 'Neptune' },
  '44.4': { exaltation: 'Pluto', detriment: 'Sun' },
  '44.5': { exaltation: 'Uranus', detriment: 'Mars' },
  '44.6': { exaltation: 'Pluto', detriment: 'Earth' },
  '45.1': { exaltation: 'Jupiter', detriment: 'Mars' },
  '45.2': { exaltation: 'Uranus', detriment: 'Mars' },
  '45.3': { exaltation: 'Neptune', detriment: 'Mars' },
  '45.4': { exaltation: 'Jupiter', detriment: 'Mars' },
  '45.5': { exaltation: 'Uranus', detriment: 'Jupiter' },
  '45.6': { exaltation: 'Uranus', detriment: 'Jupiter' },
  '46.1': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '46.2': { exaltation: 'Sun', detriment: 'Mars' },
  '46.3': { exaltation: 'Moon', detriment: 'Mars' },
  '46.4': { exaltation: 'Earth', detriment: 'Pluto' },
  '46.5': { exaltation: 'Moon', detriment: 'Neptune' },
  '46.6': { exaltation: 'Saturn', detriment: 'Neptune' },
  '47.1': { exaltation: 'Saturn', detriment: 'Neptune' },
  '47.2': { exaltation: 'Saturn', detriment: 'Mercury' },
  '47.3': { exaltation: 'Jupiter', detriment: 'Mars' },
  '47.4': { exaltation: 'Saturn', detriment: 'Moon' },
  '47.5': { exaltation: 'Venus', detriment: null },
  '47.6': { exaltation: null, detriment: 'Sun' },
  '48.1': { exaltation: 'Moon', detriment: 'Mars' },
  '48.2': { exaltation: 'Pluto', detriment: 'Venus' },
  '48.3': { exaltation: 'Moon', detriment: 'Mercury' },
  '48.4': { exaltation: 'Sun', detriment: 'Earth' },
  '48.5': { exaltation: 'Mars', detriment: 'Moon' },
  '48.6': { exaltation: 'Venus', detriment: 'Moon' },
  '49.1': { exaltation: 'Jupiter', detriment: 'Sun' },
  '49.2': { exaltation: 'Earth', detriment: 'Pluto' },
  '49.3': { exaltation: 'Neptune', detriment: 'Pluto' },
  '49.4': { exaltation: 'Jupiter', detriment: 'Mars' },
  '49.5': { exaltation: 'Moon', detriment: 'Mars' },
  '49.6': { exaltation: 'Neptune', detriment: 'Saturn' },
  '50.1': { exaltation: 'Mars', detriment: 'Venus' },
  '50.2': { exaltation: 'Sun', detriment: 'Venus' },
  '50.3': { exaltation: 'Moon', detriment: 'Mercury' },
  '50.4': { exaltation: 'Saturn', detriment: 'Mars' },
  '50.5': { exaltation: 'Saturn', detriment: 'Mars' },
  '50.6': { exaltation: 'Venus', detriment: 'Moon' },
  '51.1': { exaltation: 'Pluto', detriment: 'Venus' },
  '51.2': { exaltation: 'Mars', detriment: 'Mercury' },
  '51.3': { exaltation: 'Sun', detriment: 'Jupiter' },
  '51.4': { exaltation: 'Uranus', detriment: 'Mercury' },
  '51.5': { exaltation: 'Sun', detriment: 'Mars' },
  '51.6': { exaltation: 'Sun', detriment: 'Pluto' },
  '52.1': { exaltation: 'Earth', detriment: 'Mars' },
  '52.2': { exaltation: 'Venus', detriment: 'Mars' },
  '52.3': { exaltation: 'Saturn', detriment: 'Venus' },
  '52.4': { exaltation: 'Saturn', detriment: 'Jupiter' },
  '52.5': { exaltation: 'Earth', detriment: 'Pluto' },
  '52.6': { exaltation: 'Venus', detriment: 'Neptune' },
  '53.1': { exaltation: 'Neptune', detriment: 'Venus' },
  '53.2': { exaltation: 'Moon', detriment: 'Mars' },
  '53.3': { exaltation: 'Moon', detriment: 'Mars' },
  '53.4': { exaltation: 'Moon', detriment: 'Venus' },
  '53.5': { exaltation: 'Neptune', detriment: 'Earth' },
  '53.6': { exaltation: 'Moon', detriment: 'Pluto' },
  '54.1': { exaltation: 'Pluto', detriment: 'Venus' },
  '54.2': { exaltation: 'Saturn', detriment: 'Venus' },
  '54.3': { exaltation: 'Pluto', detriment: 'Venus' },
  '54.4': { exaltation: null, detriment: null },
  '54.5': { exaltation: 'Sun', detriment: null },
  '54.6': { exaltation: 'Saturn', detriment: 'Jupiter' },
  '55.1': { exaltation: 'Jupiter', detriment: 'Venus' },
  '55.2': { exaltation: 'Venus', detriment: 'Earth' },
  '55.3': { exaltation: 'Saturn', detriment: 'Mars' },
  '55.4': { exaltation: 'Jupiter', detriment: 'Mars' },
  '55.5': { exaltation: 'Mars', detriment: 'Sun' },
  '55.6': { exaltation: 'Saturn', detriment: 'Moon' },
  '56.1': { exaltation: 'Moon', detriment: 'Mars' },
  '56.2': { exaltation: 'Uranus', detriment: 'Moon' },
  '56.3': { exaltation: 'Sun', detriment: 'Venus' },
  '56.4': { exaltation: 'Moon', detriment: 'Mercury' },
  '56.5': { exaltation: 'Uranus', detriment: 'Mars' },
  '56.6': { exaltation: 'Sun', detriment: 'Pluto' },
  '57.1': { exaltation: 'Venus', detriment: 'Moon' },
  '57.2': { exaltation: 'Venus', detriment: 'Moon' },
  '57.3': { exaltation: 'Mercury', detriment: null },
  '57.4': { exaltation: 'Venus', detriment: 'Mars' },
  '57.5': { exaltation: 'Pluto', detriment: 'Moon' },
  '57.6': { exaltation: 'Uranus', detriment: 'Mars' },
  '58.1': { exaltation: 'Venus', detriment: 'Moon' },
  '58.2': { exaltation: null, detriment: 'Uranus' },
  '58.3': { exaltation: 'Uranus', detriment: 'Mars' },
  '58.4': { exaltation: 'Pluto', detriment: 'Neptune' },
  '58.5': { exaltation: 'Moon', detriment: 'Sun' },
  '58.6': { exaltation: 'Moon', detriment: 'Mercury' },
  '59.1': { exaltation: 'Sun', detriment: 'Mercury' },
  '59.2': { exaltation: 'Uranus', detriment: 'Pluto' },
  '59.3': { exaltation: 'Saturn', detriment: 'Mars' },
  '59.4': { exaltation: 'Venus', detriment: 'Mercury' },
  '59.5': { exaltation: 'Sun', detriment: 'Uranus' },
  '59.6': { exaltation: 'Venus', detriment: 'Mercury' },
  '60.1': { exaltation: 'Venus', detriment: 'Mercury' },
  '60.2': { exaltation: 'Saturn', detriment: 'Earth' },
  '60.3': { exaltation: 'Saturn', detriment: 'Mars' },
  '60.4': { exaltation: 'Mercury', detriment: 'Venus' },
  '60.5': { exaltation: 'Neptune', detriment: 'Jupiter' },
  '60.6': { exaltation: 'Uranus', detriment: 'Mercury' },
  '61.1': { exaltation: 'Neptune', detriment: 'Venus' },
  '61.2': { exaltation: 'Moon', detriment: 'Mars' },
  '61.3': { exaltation: 'Moon', detriment: 'Mars' },
  '61.4': { exaltation: 'Saturn', detriment: 'Jupiter' },
  '61.5': { exaltation: 'Saturn', detriment: 'Mars' },
  '61.6': { exaltation: 'Pluto', detriment: 'Mars' },
  '62.1': { exaltation: 'Neptune', detriment: 'Mars' },
  '62.2': { exaltation: 'Saturn', detriment: 'Mercury' },
  '62.3': { exaltation: 'Uranus', detriment: 'Venus' },
  '62.4': { exaltation: 'Venus', detriment: 'Pluto' },
  '62.5': { exaltation: 'Moon', detriment: 'Neptune' },
  '62.6': { exaltation: 'Saturn', detriment: 'Mercury' },
  '63.1': { exaltation: 'Sun', detriment: 'Mars' },
  '63.2': { exaltation: 'Jupiter', detriment: 'Mars' },
  '63.3': { exaltation: 'Jupiter', detriment: 'Saturn' },
  '63.4': { exaltation: 'Mercury', detriment: 'Mars' },
  '63.5': { exaltation: 'Sun', detriment: 'Mars' },
  '63.6': { exaltation: 'Pluto', detriment: 'Jupiter' },
  '64.1': { exaltation: 'Venus', detriment: 'Mars' },
  '64.2': { exaltation: 'Venus', detriment: 'Moon' },
  '64.3': { exaltation: 'Saturn', detriment: 'Moon' },
  '64.4': { exaltation: 'Moon', detriment: 'Mars' },
  '64.5': { exaltation: 'Venus', detriment: 'Jupiter' },
  '64.6': { exaltation: 'Mercury', detriment: 'Venus' }
};

/**
 * Enrich a planetary activation with genetic data and gate enrichment
 */
function enrichActivation(activation, planetName) {
  const { gate, line, color, tone, base } = activation;
  const gateKey = `${gate}.${line}`;

  // Get amino acid data
  const aminoData = aminoAcidByGate[gate] || {};

  // Get codon data
  const codon = codonByGate[gate] || null;

  // Get I Ching glyph
  const iChingGlyph = I_CHING_GLYPHS[gate] || null;

  // Get center origin
  const centerOrigin = GATE_TO_CENTER[gate] || null;

  // Get harmonic partner (opposite gate in wheel)
  const harmonicPartner = HARMONIC_GATES[gate] || null;

  // Get electromagnetic partner (channel partner)
  const electromagnetPartner = ELECTROMAGNETIC_GATES[gate] || null;

  // Get exaltation/detriment data and determine fixing state
  const fixingData = exaltationsDetriments[gateKey] || {};
  let fixingState = undefined;

  // Check if planet matches exaltation or detriment
  if (planetName === fixingData.exaltation) {
    fixingState = 'exalted';
  } else if (planetName === fixingData.detriment) {
    fixingState = 'detriment';
  }
  // else: leave undefined
  // Note: Juxtaposition will be detected later by comparing personality and design

  const result = {
    ...activation,
    iChingGlyph,
    centerOrigin,
    harmonicPartner,
    electromagnetPartner,
    color,
    tone,
    base,
    aminoAcid: aminoData.name || null,
    codonRing: aminoData.ring || null,
    codon: codon
  };

  if (fixingState) {
    result.fixingState = fixingState;
  }

  return result;
}

/**
 * Detect juxtapositions across personality and design activations
 * Juxtaposition occurs when BOTH the exalting planet AND the detrimenting planet
 * for a specific gate.line are present in the chart (one in personality, one in design)
 *
 * This is EXTREMELY rare - requires the exact two specific planets in the same
 * gate.line split across personality/design
 *
 * @param {Object} personalityActivations - All personality planet activations
 * @param {Object} designActivations - All design planet activations
 */
function detectJuxtapositions(personalityActivations, designActivations) {
  // For each possible gate.line combination (64 gates × 6 lines = 384 total)
  for (let gate = 1; gate <= 64; gate++) {
    for (let line = 1; line <= 6; line++) {
      const gateKey = `${gate}.${line}`;
      const fixingData = exaltationsDetriments[gateKey];

      // Skip if this gate.line doesn't have both exaltation AND detriment defined
      if (!fixingData || !fixingData.exaltation || !fixingData.detriment) {
        continue;
      }

      // Track if we find the exalting planet and detrimenting planet at this gate.line
      let exaltingActivation = null;
      let detrimentingActivation = null;

      // Check all personality planets
      for (const planet in personalityActivations) {
        const activation = personalityActivations[planet];
        if (activation.gate === gate && activation.line === line) {
          if (planet === fixingData.exaltation) {
            exaltingActivation = activation;
          }
          if (planet === fixingData.detriment) {
            detrimentingActivation = activation;
          }
        }
      }

      // Check all design planets
      for (const planet in designActivations) {
        const activation = designActivations[planet];
        if (activation.gate === gate && activation.line === line) {
          if (planet === fixingData.exaltation) {
            exaltingActivation = activation;
          }
          if (planet === fixingData.detriment) {
            detrimentingActivation = activation;
          }
        }
      }

      // If we found BOTH the exalting and detrimenting planets at this gate.line,
      // mark both activations as juxtaposition
      if (exaltingActivation && detrimentingActivation) {
        exaltingActivation.fixingState = 'juxtaposition';
        detrimentingActivation.fixingState = 'juxtaposition';
      }
    }
  }
}

module.exports = {
  aminoAcidByGate,
  codonByGate,
  exaltationsDetriments,
  enrichActivation,
  detectJuxtapositions
};
