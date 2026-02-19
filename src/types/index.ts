export interface FieldMapping {
  columnIndex: number;
  columnName: string;
  order: number;
  defaultValue?: string;
  lineBreakAfter?: boolean;
}

export interface AddressData {
  recipientLines: string[];
  addressLines: string[];
  recipientLineBreaks?: boolean[];
}

export interface SenderData {
  postalCode: string;
  address: string;
  name: string;
}

export interface LabelTemplate {
  code: string;
  name: string;
  rows: number;
  cols: number;
  totalLabels: number;
  labelWidth: number;
  labelHeight: number;
  marginTop: number;
  marginLeft: number;
  marginRight: number;
  marginBottom: number;
  horizontalGap: number;
  verticalGap: number;
}

export interface PrintSettings {
  template: LabelTemplate;
  startPosition: number;
  offsetX: number;
  offsetY: number;
  includeSender: boolean;
  senderData: SenderData | null;
  fontFamily: 'mincho' | 'gothic';
}

export type InputMode = 'manual' | 'csv';
