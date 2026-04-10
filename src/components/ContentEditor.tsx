import React, { useState, KeyboardEvent } from 'react';
import styles from '../styles/contentEditor.module.css';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

export type ContentType = 'text' | 'image' | 'step';

export interface ContentItem {
  type: ContentType;
  text: string;
  images: string[];
  step: number;
  stepTo: number;
  _id: string
}

export interface ContentEditorProps {
  value: any;
  onChange: (value: any) => void;
}

const parseContent = (input: string, _id: string): ContentItem => {
  const trimmed = input.trim();

  // Image parsing: <url1><url2>
  const imageMatches = trimmed.match(/<([^>]+)>/g);
  if (imageMatches) {
    const urls = imageMatches.map(m => m.slice(1, -1));
    return { type: 'image', text: '', images: urls, step: 0, stepTo: 0, _id:_id };
  }

  // Step parsing: "1. metn" və ya "1-3. metn"
  const stepMatch = trimmed.match(/^(\d+)(?:-(\d+))?\.\s*(.*)/);
  if (stepMatch) {
    return {
      type: 'step',
      step: parseInt(stepMatch[1]) | 0,
      stepTo: stepMatch[2] ? parseInt(stepMatch[2]) : 0,
      text: stepMatch[3],
      images: [],
      _id: _id
    };
  }

  // Standart text
  return { type: 'text', text: trimmed, images: [], step: 0, stepTo: 0, _id:_id };
};

export const ContentEditor: React.FC<ContentEditorProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputId, setInputId] = useState('')

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange(items);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newItem = parseContent(inputValue, inputId);
      onChange([...value, newItem]);
      setInputValue('');
      setInputId('')
    }
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_:any, i:any) => i !== index));
  };

  const editChip = (index: number) => {
    const item = value[index];

    let textToSet = '';
    if (item.type === 'image') {
      textToSet = item.images.map((url:any) => `<${url}>`).join('');
    } else if (item.type === 'step') {
      textToSet = `${item.step}${item.stepTo ? `-${item.stepTo}` : ''}. ${item.text}`;
    } else {
      textToSet = item.text;
    }
    setInputValue(textToSet);
    setInputId(item._id)
    removeChip(index);
  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="content-list" direction="vertical">
          {(provided) => (
            <div 
              className={styles.listWrapper}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {value.map((item:any, index:any) => (
                <Draggable key={index} draggableId={`item-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.row} ${styles[item.type]}`}
                    >
                      <div className={styles.dragHandle}>⠿</div>
                      <div className={styles.contentArea} onClick={() => editChip(index)}>
                        {item.type === 'image' ? (
                          <div className={styles.imageGrid}>
                             {item.images.map((url:any, i:any) => (
                               <img key={i} src={url} alt="content" className={styles.previewThumb} />
                             ))}
                             <span>{item.images.length} şəkil</span>
                          </div>
                        ) : (
                          <span className={styles.textLabel}>
                            {item.type === 'step' && <b>{item.step}{item.stepTo ? `-${item.stepTo}` : ''}. </b>}
                            {item.text}
                          </span>
                        )}
                      </div>
                      <button onClick={() => removeChip(index)} className={styles.deleteBtn}>×</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Yeni sətir yazın və Enter basın..."
          className={styles.input}
        />
      </div>
    </div>
  );
};