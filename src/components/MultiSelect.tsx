import React, { useId } from 'react';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import styles from '../styles/products.module.css';

interface MultiSelectProps {
  label: string;
  name: string;
  control: any;
  options: { value: string; label: string }[];
  error?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, name, control, options, error }) => {

  const uniqueId = useId();
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            instanceId={uniqueId}
            {...field}            
            isMulti
            options={options}
            placeholder="Seçim edin..."
            // react-select massiv qaytarır, bizə lazımdırsa value-ları götürürük
            value={options.filter(obj => field.value?.includes(obj.value))}
            onChange={(val) => field.onChange(val.map(v => v.value))}
            classNamePrefix="react-select"
          />
        )}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default MultiSelect;