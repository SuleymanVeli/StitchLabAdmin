import { useForm, useFieldArray, Controller, Form } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../lib/axios';
import styles from '../styles/productslanguage.module.css';
import { useRouter } from 'next/router';
import SectionContent from '@/components/SectionContent';
import FormInput from '@/components/FormInput';
import FormTextArea from '@/components/FormTextArea';
import Button from '@/components/Button';
import { useEffect, useState } from 'react';
import MultiSelect from '@/components/MultiSelect';
import PreviewModal from '@/components/PreviewModal';
import Loading from '@/components/Loading';
import SectionContentLanguage from '@/components/SectionContentLanguage';

const sectionContentSchema = z.object({
    type: z.enum(['text', 'image', 'step']),
    text: z.string().optional(),
    images: z.array(z.string()).optional(),
    step: z.number().optional(),
});

// Validation Sxemi (Modelə tam uyğun)
const schema = z.object({
    title: z.string().min(3, "Ad çox qısadır"),
    description: z.string().min(10, "Açıqlama çox qısadır minimum 10 simvol olmalıdır"),
    categories: z.array(z.string()).min(1, "Ən azı bir kateqoriya seçin"),

    difficulty: z.enum(['easy', 'medium', 'hard']),
    isPro: z.boolean().default(false),

    images: z.object({
        large: z.string(),
        thumbnail: z.string(),
    }),
    preparation: z.object({
        main: z.object({
            yarn: z.string().min(1, "İp növünü yazın"),
            hook: z.string().min(1, "Tiğ ölçüsünü yazın"),
        }),
        extras: z.array(z.string()).optional()
    }),
    sections: z.array(z.object({
        name: z.string().min(1, "Hissə adı vacibdir"),
        sectionImage: z.string().min(1, "Hissə şəkli tələb olunur"),
        content: z.array(sectionContentSchema)
    })),
    abbreviations: z.array(z.string()).min(1, "Qısaltmaları qeyd edin"),
});

const CATEGORY_OPTIONS = [
    { value: 'Oyuncaq', label: 'Oyuncaq' },
    { value: 'Amigurumi', label: 'Amigurumi' },
    { value: 'Dovşan', label: 'Dovşan' },
    { value: 'Geyim', label: 'Geyim' }
];

// Qısaltmalar üçün seçimlər 50 eded
const ABBREVIATION_OPTIONS = [
    { value: 'sc', label: 'sc (Sıx iynə)' },
    { value: 'inc', label: 'inc (Artırma)' },
    { value: 'dec', label: 'dec (Azaltma)' },
    { value: 'ch', label: 'ch (Zəncir)' },
    { value: 'slst', label: 'slst (Slip Stitch)' },
    { value: 'hdc', label: 'hdc (Half Double Crochet)' },
    { value: 'dc', label: 'dc (Double Crochet)' },
];

const EXTRA_MATERIAL_OPTIONS = [
    { value: 'scissors', label: 'Qayçı' },
    { value: 'needle', label: 'İynə' },
    { value: 'stuffing', label: 'Dolgu Materialı' },
    { value: 'safety-eyes', label: 'Təhlükəsiz Gözlər' },
    { value: 'stitch-markers', label: 'Stitch Markerlər' }
];

export default function ProductFormLanguage() {

    const router = useRouter();
    const { id, lang } = router.query; // productForm?id=123
    const isEditMode = !!id;
    const [loading, setLoading] = useState(isEditMode);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [dataAz, setDataAz] = useState<any>(null);

    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting }, getValues, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            difficulty: 'easy',
            isPro: false,
            sections: [{ name: '', sectionImage: '', content: [{ step: 1, text: '', type: 'text' }] }]
        }
    });

    const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
        control,
        name: "sections"
    });

    const formData = getValues();

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data : dataAz } = await api.get(`/products?id=${id}&lang=az`);
                const { data } = await api.get(`/products?id=${id}&lang=${lang}`);

                setDataAz(dataAz);

                reset(data);
                setLoading(false);
            } catch (error) {
                router.push('/productform');
            }
        };

        fetchProduct();
    }, [id, reset]);

    const onSubmit = async (data: any) => {

        console.log("Form Data:", data); // Göndəriləcək məlumatları konsola yazdırın

        // return; // API çağırışını test etmək üçün burada dayandırın
        try {
            if (isEditMode) {
                await api.put(`/products?id=${id}&lang=${lang}`, data); // Redaktə
            }
            router.push('/products');
        } catch (error) {
            alert("Xəta baş verdi");
        }
    };

    if (loading) return <Loading fullScreen message="Məlumatlar gətirilir..." />;

    return (
        <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
                <h1 className={styles.pageTitle}>Dizaynı Redaktə Et</h1>
                <p>StitchLab üçün yeni pattern məlumatlarını daxil edin</p>
                <Button type="button" variant="danger" onClick={() => setIsPreviewOpen(true)}>
                    👁️ Ön Baxış
                </Button>
            </div>

            <div className={styles.flexWrapper}>
                <div className={styles.mainForm}>
                    {/* Əsas Məlumatlar */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Ümumi Məlumatlar</h3>

                        <FormInput
                            label="Layihənin Adı"
                            placeholder="Məs: Şirin Dovşan"
                            otherProps={{ value: dataAz?.title || '' }}
                        />

                        <FormTextArea
                            label="Açıqlama"
                            placeholder="Layihə haqqında qısa məlumat..."
                            otherProps={{ value: dataAz?.description || '' }}
                        />
                    </div>

                    {/* Materiallar */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Lazım olan Materiallar</h3>
                        <div className={styles.flexRow}>
                            <FormInput
                                label="İp (Yarn)"
                                placeholder="Məs: Cotton Gold"
                                otherProps={{value: dataAz?.preparation?.main?.yarn || ''}}
                            />
                            <FormInput
                                label="Tiğ (Hook)"
                                placeholder="Məs: 2.5 mm"
                                otherProps={{value: dataAz?.preparation?.main?.hook || ''}}
                            />
                        </div>
                    </div>

                    {/* Dinamik Pattern Hissələri */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Model Hissələri</h3>
                        {dataAz?.sections?.map((section : any, sIndex : number) => (
                            <div key={sIndex} className={styles.sectionBox}>   
                              <div className={styles.sectionHead}>
                                    <FormInput
                                        label={`Hissənin Adı (məs: Baş, Bədən, Qollar)`}
                                        placeholder="Hissənin adı (məs: Baş və ya Qollar)"
                                        otherProps={{value: section.name}}
                                    />
                                </div>                                                            
                                <SectionContentLanguage                                  
                                    value={section.content}
                                />
                            </div>
                        ))}

                       { console.log("Sections:", dataAz?.sections)}
                    </div>                   
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.mainForm}>
                    {/* Əsas Məlumatlar */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Ümumi Məlumatlar</h3>

                        <FormInput
                            label="Layihənin Adı"
                            placeholder="Məs: Şirin Dovşan"
                            registration={register("title")}
                            error={errors.title?.message as string}
                        />

                        <FormTextArea
                            label="Açıqlama"
                            placeholder="Layihə haqqında qısa məlumat..."
                            registration={register("description")}
                            error={errors.description?.message as string}
                        />
                    </div>

                    {/* Materiallar */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Lazım olan Materiallar</h3>
                        <div className={styles.flexRow}>
                            <FormInput
                                label="İp (Yarn)"
                                placeholder="Məs: Cotton Gold"
                                registration={register("preparation.main.yarn")}
                                error={errors.preparation?.main?.yarn?.message as string}
                            />
                            <FormInput
                                label="Tiğ (Hook)"
                                placeholder="Məs: 2.5 mm"
                                registration={register("preparation.main.hook")}
                                error={errors.preparation?.main?.hook?.message as string}
                            />
                        </div>
                    </div>

                    {/* Dinamik Pattern Hissələri */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Model Hissələri</h3>
                        {sectionFields.map((section, sIndex) => (
                            <div key={section.id} className={styles.sectionBox}>
                                <div className={styles.sectionHead}>
                                    <FormInput
                                        label={`Hissənin Adı (məs: Baş, Bədən, Qollar)`}
                                        placeholder="Hissənin adı (məs: Baş və ya Qollar)"
                                        registration={register(`sections.${sIndex}.name` as const)}
                                        error={errors.sections?.[sIndex]?.name?.message as string}
                                    />
                                </div>
                              
                                <SectionContentLanguage
                                    sIndex={sIndex}
                                    control={control}
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                        ))}

                    </div>


                    <Button type="submit" disabled={isSubmitting} variant={'primary'}>
                        Yadda Saxla
                    </Button>
                    <div style={{ padding: "10px", display: "inline-block" }}></div>
                    <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(true)}>
                        👁️ Ön Baxış
                    </Button>
                </form>
            </div>


            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                data={formData}
            />
        </div>
    );
}