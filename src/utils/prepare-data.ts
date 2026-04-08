// utils/prepare-data.ts

export function prepareForStorage(data: any) {
  // String-i obyektə çevirən köməkçi
  const toAz = (val: string) => ({
    az: val || ""   
  });

  return {
    ...data,
    title: typeof data.title === 'string' ? toAz(data.title) : data.title,
    description: typeof data.description === 'string' ? toAz(data.description) : data.description,
    
    preparation: {
      ...data.preparation,
      main: {
        yarn: toAz(data.preparation?.main?.yarn),
        hook: toAz(data.preparation?.main?.hook),
      }
    },

    sections: data.sections?.map((section: any) => ({
      ...section,
      name: toAz(section.name),
      content: section.content?.map((step: any) => ({
        ...step,
        text: step.text ? toAz(step.text) : undefined
      }))
    })),
    
  };
}

