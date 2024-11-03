import log from '@/common/log/log';
import store from '@/stores/store';
import model from '@/models/index';
export default async function ({ tag, draft }) {
  try {
    const data = await model.category.create({
      saasId: saasId(),
      title: draft.title,
    });
    draft._id = data.id;
    store.category.addCategory({ tag, category: draft });
    log.info(tag, 'category-create', draft);
    return draft;
  } catch (error) {
    log.error(tag, 'category-create', error);
    throw error;
  }
}
