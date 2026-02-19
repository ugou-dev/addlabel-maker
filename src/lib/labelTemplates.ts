import { LabelTemplate } from '../types';

export const LABEL_TEMPLATES: LabelTemplate[] = [
  {
    code: '28382',
    name: 'エーワン 28382（12面）',
    rows: 4,
    cols: 3,
    totalLabels: 12,
    labelWidth: 63.5,
    labelHeight: 72,
    marginTop: 15.5,
    marginLeft: 12.5,
    marginRight: 12.5,
    marginBottom: 15.5,
    horizontalGap: 2.5,
    verticalGap: 0,
  },
  {
    code: '28386',
    name: 'エーワン 28386（24面）',
    rows: 6,
    cols: 4,
    totalLabels: 24,
    labelWidth: 48.3,
    labelHeight: 46.6,
    marginTop: 15.5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15.5,
    horizontalGap: 2.5,
    verticalGap: 2.5,
  },
  {
    code: '28387',
    name: 'エーワン 28387（10面）',
    rows: 5,
    cols: 2,
    totalLabels: 10,
    labelWidth: 86.4,
    labelHeight: 50.8,
    marginTop: 20.5,
    marginLeft: 18.8,
    marginRight: 18.8,
    marginBottom: 20.5,
    horizontalGap: 0,
    verticalGap: 5,
  },
];

export function getLabelPosition(
  template: LabelTemplate,
  index: number,
  offsetX: number = 0,
  offsetY: number = 0
): { x: number; y: number } {
  const row = Math.floor(index / template.cols);
  const col = index % template.cols;

  const x =
    template.marginLeft +
    col * (template.labelWidth + template.horizontalGap) +
    offsetX;
  const y =
    template.marginTop +
    row * (template.labelHeight + template.verticalGap) +
    offsetY;

  return { x, y };
}
