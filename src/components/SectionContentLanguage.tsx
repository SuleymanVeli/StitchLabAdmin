import { useFieldArray, useWatch } from 'react-hook-form';
import styles from '../styles/products.module.css';
import FormInput from './FormInput';
import FormTextArea from './FormTextArea';

// 1. Hər bir sətir üçün ayrıca komponent yaradırıq
function ContentRow({ sIndex, cIndex, control, register, value }: any) {

    if (value) 
        return (
        <div className={styles.contentRow}>
            <div className={styles.contentBody}>
                {value.type === 'step' && (
                    <div className={styles.stepGrid}>
                        <FormInput
                            label="Təlimat (məs: 6 sc in MR)"
                            placeholder="Təlimat (məs: 6 sc in MR)"
                            otherProps={{value: value.text}}
                        />
                    </div>
                )}

                {value.type === 'text' && (
                    <FormTextArea
                        label="Qeyd və ya xüsusi təlimat"
                        placeholder="Qeyd və ya xüsusi təlimat..."
                        otherProps={{value: value.text}}
                    />
                )}
            </div>
        </div>
    );



    // useWatch artıq dövrün içində deyil, bu komponentin ən yuxarı hissəsindədir
    const contentType = useWatch({
        control,
        name: `sections.${sIndex}.content.${cIndex}.type`,
        defaultValue: 'step'
    });

    return (
        <div className={styles.contentRow}>
            <div className={styles.contentBody}>
                {contentType === 'step' && (
                    <div className={styles.stepGrid}>
                        <FormInput
                            label="Təlimat (məs: 6 sc in MR)"
                            placeholder="Təlimat (məs: 6 sc in MR)"
                            registration={register(`sections.${sIndex}.content.${cIndex}.text` as const)}
                        />
                    </div>
                )}

                {contentType === 'text' && (
                    <FormTextArea
                        label="Qeyd və ya xüsusi təlimat"
                        placeholder="Qeyd və ya xüsusi təlimat..."
                        registration={register(`sections.${sIndex}.content.${cIndex}.text` as const)}
                    />
                )}
            </div>
        </div>
    );
}

// 2. Əsas SectionContent komponenti
export default function SectionContent({ sIndex, control, register, value }: any) {

    if (value) return (
       <div className={styles.contentWrapper}>
            {value.map((item : any, cIndex : number) => (
                <ContentRow
                    key={cIndex}
                    value={item}
                />
            ))}
        </div>);

    const { fields } = useFieldArray({
        control,
        name: `sections.${sIndex}.content`
    });

    return (
        <div className={styles.contentWrapper}>
            {fields.map((item, cIndex) => (
                // Hook-u burada çağırmırıq, datanı komponentə ötürürük
                <ContentRow
                    key={item.id}
                    sIndex={sIndex}
                    cIndex={cIndex}
                    control={control}
                    register={register}
                />
            ))}
        </div>
    );
}