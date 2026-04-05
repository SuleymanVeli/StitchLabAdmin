// utils/update-helper.ts

export function applyLocalizedUpdate(doc: any, newData: any, lang: string) {
    // 1. Sadə sahələrin yenilənməsi (Title, Description)
    if (newData.title) doc.title[lang] = newData.title;
    if (newData.description) doc.description[lang] = newData.description;

    // 2. Preparation (Yarn, Hook)
    if (newData.preparation?.main) {
        if (newData.preparation.main.yarn) doc.preparation.main.yarn[lang] = newData.preparation.main.yarn;
        if (newData.preparation.main.hook) doc.preparation.main.hook[lang] = newData.preparation.main.hook;
    }

    // 3. Sections (Bölmələr və Addımlar)
    if (newData.sections && Array.isArray(newData.sections)) {
        newData.sections.forEach((newSec: any, index: number) => {
            if (doc.sections[index]) {
                // Bölmə adını yenilə
                if (newSec.name) doc.sections[index].name[lang] = newSec.name;
                if (newSec.sectionImage) doc.sections[index].sectionImage = newSec.sectionImage;

                // Addımları (content) yenilə
                if (newSec.content && Array.isArray(newSec.content)) {
                    newSec.content.forEach((newStep: any, stepIndex: number) => {
                        if (doc.sections[index].content[stepIndex]) {
                            // Yalnız text olan addımları yeniləyirik
                            if (newStep.text) {
                                doc.sections[index].content[stepIndex].text[lang] = newStep.text;
                                doc.sections[index].content[stepIndex].type = newStep.type || 'text'; // Tipi text olaraq təyin edirik
                                doc.sections[index].content[stepIndex].images = newStep.images || []; // Şəkilləri yeniləyirik
                            }
                        }
                    });
                }
            }
        });
    }

    // 4. Dildən asılı olmayan (Global) sahələr
    if (newData.abbreviations) doc.abbreviations = newData.abbreviations;
    if (newData.preparation?.extras) doc.preparation.extras = newData.preparation.extras;
    if (newData.images) doc.images = newData.images;
    if (newData.categories) doc.categories = newData.categories;
    if (newData.difficulty) doc.difficulty = newData.difficulty;
    if (newData.isPro !== undefined) doc.isPro = newData.isPro;

    return doc;
}