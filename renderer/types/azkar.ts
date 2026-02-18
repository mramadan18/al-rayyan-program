export interface Zikr {
  order: number;
  content: string;
  count: number;
  count_description: string;
  fadl: string;
  source: string;
  type: 0 | 1 | 2; // 0: Both, 1: Morning, 2: Evening
  audio: string;
  hadith_text: string;
  explanation_of_hadith_vocabulary: string;
}
