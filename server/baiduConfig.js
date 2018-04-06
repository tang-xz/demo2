// curl -i -k 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=ShsoI1RkqMG5sDOGUTGTaKCp&client_secret=yhXSeurFo9XVrd2GEQnyfb5VeTABwhGG'
module.exports = {
  auth: {
    access_token: "24.e51dd38c371ac09523b0ce3cf0850463.2592000.1525501812.282335-10875867",
    session_key: "9mzdXvCDJLT08LyvddvEGGUNVapcOzp0L5yZejplnCirf/z6lENPq+O0zkVhNTx/i+bpL4PT5dD6kZewZgfkrixTsMubpw==",
    scope:
      "public vis-faceverify_faceverify vis-faceattribute_faceattribute vis-faceverify_faceverify_v2 vis-faceverify_faceverify_match_v2 brain_all_scope vis-faceverify_vis-faceverify-detect wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian ApsMisTest_Test\u6743\u9650 vis-classify_flower lpq_\u5f00\u653e cop_helloScope ApsMis_fangdi_permission smartapp_snsapi_base",
    refresh_token: "25.c007b0c252e5ee38dbf5123fe84d7f48.315360000.1838269812.282335-10875867",
    session_secret: "c12279dec61726fe8d99b21610a8da9d",
    expires_in: 2592000
  },
  baseURL: "https://aip.baidubce.com/rest/2.0/face/v2/",
  api: {
    search: ["/identify", "POST"],
    add: ["/faceset/user/add", "POST"],
    getUsers: ["/faceset/group/getusers", "GET"],
    match: ["/match", "POST"]
  }
}
