import { useFieldArray, useWatch } from 'react-hook-form';
import styles from '../styles/products.module.css';
import FormInput from './FormInput';
import FormTextArea from './FormTextArea';
import Button from './Button';

// 1. Hər bir sətir üçün ayrıca komponent yaradırıq
function ContentRow({ sIndex, cIndex, control, register, remove, getValues, setValue }: any) {
    // useWatch artıq dövrün içində deyil, bu komponentin ən yuxarı hissəsindədir
    const contentType = useWatch({
        control,
        name: `sections.${sIndex}.content.${cIndex}.type`,
        defaultValue: 'step'
    });

    const currentImages = useWatch({
        control,
        name: `sections.${sIndex}.content.${cIndex}.images`,
        defaultValue: []
    });

    return (
        <div className={styles.contentRow}>
            <div className={styles.contentHeader}>
                <div className={styles.formGroup}>
                    <label>Tip</label>
                    <select
                        {...register(`sections.${sIndex}.content.${cIndex}.type` as const)}
                        className={styles.typeSelect}
                    >
                        <option value="step">Addım (Step)</option>
                        <option value="text">Mətn (Text)</option>
                        <option value="image">Şəkil (Image)</option>
                    </select>
                </div>

                <Button type="button" variant={'danger'} onClick={() => remove(cIndex)}>
                    Sətiri Sil
                </Button>
            </div>

            <div className={styles.contentBody}>
                {contentType === 'step' && (
                    <div className={styles.stepGrid}>
                        <FormInput
                            label="Sıra"
                            placeholder="Sıra"
                            registration={register(`sections.${sIndex}.content.${cIndex}.step` as const, { valueAsNumber: true })}
                            type="number"
                        />
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



                {contentType === 'image' && (
                    <div className={styles.imageSection}>
                        <label className={styles.inputLabel}>Şəkil URL-ləri</label>

                        <div className={styles.imageGridList}>
                            {currentImages.map((_: any, imgIndex: number) => (
                                <div key={imgIndex} className={styles.imageInputRow}>

                                    <FormInput
                                        label={`URL ${imgIndex + 1}`}
                                        placeholder={`URL ${imgIndex + 1}`}
                                        registration={register(`sections.${sIndex}.content.${cIndex}.images.${imgIndex}` as const)}
                                    />
                                    
                                    {imgIndex > 0 && (
                                        <Button
                                            type="button"
                                            variant={'danger'}
                                            onClick={() => {
                                                const updated = currentImages.filter((__: any, i: number) => i !== imgIndex);
                                                setValue(`sections.${sIndex}.content.${cIndex}.images`, updated);
                                            }}
                                        >
                                            Şəkil Sil
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant={'primary'}
                            onClick={() => {
                                const current = getValues(`sections.${sIndex}.content.${cIndex}.images`) || [];
                                setValue(`sections.${sIndex}.content.${cIndex}.images`, [...current, ""]);
                            }}
                        >
                            + Şəkil Əlavə Et
                        </Button>
                    </div>
                )}


            </div>
        </div>
    );
}

// 2. Əsas SectionContent komponenti
export default function SectionContent({ sIndex, control, register, errors, getValues, setValue }: any) {
    const { fields, append, remove } = useFieldArray({
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
                    remove={remove}
                    getValues={getValues}
                    setValue={setValue}
                />
            ))}

            <Button
                type="button"
                onClick={() => append({ type: 'step', text: '', step: fields.length + 1, images: [] })}
                variant={'primary'}
            >
                + Yeni Sətir Əlavə Et
            </Button>
        </div>
    );
}