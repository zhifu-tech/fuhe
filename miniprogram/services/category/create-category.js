import log from '@/common/log/log';
import stores from '@/stores/index';
import models from '@/models/index';
export default async function ({ tag, draft }) {
  try {
    const data = await models.category.create({
      saasId: saasId(),
      title: draft.title,
    });
    draft._id = data.id;
    stores.category.addCategory({ tag, category: draft });
    log.info(tag, 'category-create', draft);
    return draft;
  } catch (error) {
    log.error(tag, 'category-create', error);
    throw error;
  }
}
