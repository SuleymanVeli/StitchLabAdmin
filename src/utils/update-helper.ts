// utils/update-helper.ts

export function applyLocalizedUpdate(doc: any, newData: any, lang: string) {
    // 1. Sadə sahələrin yenilənməsi
    if (newData.title) doc.title[lang] = newData.title;
    if (newData.description) doc.description[lang] = newData.description;

    if (newData.preparation?.main) {
        if (newData.preparation.main.yarn) doc.preparation.main.yarn[lang] = newData.preparation.main.yarn;
        if (newData.preparation.main.hook) doc.preparation.main.hook[lang] = newData.preparation.main.hook;
    }

    // 2. Sections (Hissələr)
    if (newData.sections && Array.isArray(newData.sections)) {
        const updatedSections = newData.sections.map((newSec: any) => {
            // MongoDB-dən gələn sənəddə bu section varmı?
            const existingSec = doc.sections.find((s: any) => s._id?.toString() === newSec._id?.toString());

            if (existingSec) {
                // MÖVCUD SECTION-I YENİLƏ
                if (newSec.name) existingSec.name[lang] = newSec.name;
                if (newSec.sectionImage) existingSec.sectionImage = newSec.sectionImage;

                // Content (Addımlar) yenilənməsi
                if (newSec.content && Array.isArray(newSec.content)) {
                    const updatedContent = newSec.content.map((newStep: any) => {
                        const existingStep = existingSec.content.find((step: any) => step._id?.toString() === newStep._id?.toString());

                        if (existingStep) {
                            // MÖVCUD ADDIMI YENİLƏ
                            if (newStep.text) existingStep.text[lang] = newStep.text;
                            existingStep.type = newStep.type || existingStep.type;
                            existingStep.images = newStep.images || existingStep.images;
                            existingStep.step = newStep.step; // Sıralama üçün vacibdir
                            return existingStep;
                        } else {
                            // YENİ ADDIM ƏLAVƏ ET
                            // Yeni addımın lokallaşdırılmış strukturunu yarat
                            return {
                                ...newStep,
                                text: { [lang]: newStep.text }
                            };
                        }
                    });
                    existingSec.content = updatedContent;
                }
                return existingSec;
            } else {
                // YENİ SECTION ƏLAVƏ ET
                // Yeni section-ın ad və content hissəsini lokallaşdırılmış formata sal
                const processedContent = (newSec.content || []).map((step: any) => ({
                    ...step,
                    text: { [lang]: step.text }
                }));

                return {
                    ...newSec,
                    name: { [lang]: newSec.name },
                    content: processedContent
                };
            }
        });

        doc.sections = updatedSections;
    }

    // 3. Global sahələr (Dildən asılı olmayan)
    if (newData.abbreviations) doc.abbreviations = newData.abbreviations;
    if (newData.preparation?.extras) doc.preparation.extras = newData.preparation.extras;
    if (newData.images) doc.images = newData.images;
    if (newData.categories) doc.categories = newData.categories;
    if (newData.difficulty) doc.difficulty = newData.difficulty;
    if (newData.isPro !== undefined) doc.isPro = newData.isPro;

    return doc;
}