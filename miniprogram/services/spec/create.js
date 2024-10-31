import log from '@/common/log/log';

export async function create({ tag, cId, title }) {
  try {
    const { data } = await wx.cloud.models.fh_spec.create({
      data: {
        cId,
        title,
      },
    });
    const spec = {
      _id: data.id,
      cId,
      title,
      options: [],
    };
    log.info(tag, 'spec-create', data, spec);
    return spec;
  } catch (error) {
    log.error(tag, 'spec-create', error);
    throw error;
  }
}

export async function createMany({ tag, cId, titles }) {
  if (titles.length === 1) {
    log.info(tag, 'spec-createMany', 'use create instead');
    const { title } = titles[0];
    const spec = await this.create({ tag, cId, title });
    return [spec];
  }
  try {
    const { data } = await wx.cloud.models.fh_spec.createMany({
      data: titles.map(({ title }) => ({
        cId,
        title,
      })),
    });
    const { idList } = data;
    const specs = idList.map((id, index) => {
      const title = titles[index];
      const spec = {
        _id: id,
        cId,
        title,
        options: [],
      };
      return spec;
    });
    log.info(tag, 'spec-createMany', titles, data, specs);
    return specs;
  } catch (error) {
    log.error(tag, 'spec-createMany', error);
    throw error;
  }
}
