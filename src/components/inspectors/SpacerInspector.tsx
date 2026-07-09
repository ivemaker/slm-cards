import React from 'react';
import { Block } from '../../types';

interface SpacerInspectorProps {
  focusedBlock: Block;
  translations: any;
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
}

export const SpacerInspector: React.FC<SpacerInspectorProps> = ({
  focusedBlock,
  translations,
  updateFocusedBlock,
}) => {
  const spacer = focusedBlock.spacerContent!;

  return (
    <div>
      <label className="block text-[9px] uppercase font-bold text-zinc-405 tracking-wider mb-1">
        {translations.block_spacer_ht}
      </label>
      <select
        value={spacer.height}
        onChange={(e) => updateFocusedBlock(b => ({ spacerContent: { height: e.target.value as any } }))}
        className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-2 text-white cursor-pointer"
      >
        <option value="small">Small Gap (24px)</option>
        <option value="medium">Medium Gap (48px)</option>
        <option value="large">Large Gap (80px)</option>
      </select>
    </div>
  );
};
