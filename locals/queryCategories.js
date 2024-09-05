async ({ params }) => {
    console.log('params', params);

    try {
        // 1. 查询分类信息
        const categories = await $w.cloud.callDataSource({
            dataSourceName: "fh_category",
            methodName: "wedaGetRecordsV2",
            params: {
                select: {
                    name: true,
                    category_spec_s: true,
                },
                orderBy: [{
                    createdAt: "desc",
                }],
                pageSize: 10,
                pageNumber: 1
            }
        });
        console.log("请求结果", categories);

        // 2. 获取所有的‘分类规格’的信息
        const cs_ids = new Set();
        categories?.records?.forEach(record => {
            const { category_spec_s } = record;
            console.log('cs_s', category_spec_s);
            category_spec_s.forEach(cs => cs_ids.add(cs._id));
            console.log("cs_id", [...cs_ids]);
        })
        // 3. 查询所有的分类规格的信息
        const cs = await $w.cloud.callDataSource({
            dataSourceName: "fh_category_spec",
            methodName: "wedaGetRecordsV2",
            params: {
                select: {
                    name: true,
                    category: true,
                    spec: true,
                },
                pageSize: 10,
                pageNumber: 1,
            }
        })

        console.log("请求结果", cs);
        return categories?.records;

    } catch (e) {
        console.log("错误代码", e.code, "错误信息", e.message);
        return e;
    }
}
