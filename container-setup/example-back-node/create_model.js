const axios = require('axios');

const apiUrl = 'http://localhost:8080'

const createStore = async () => {
    try {
        const response = axios.post(`${apiUrl}/stores`, {
            name: 'openfga-demo'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.id;
    } catch (error) {
        console.error("Cannot create store: ", error);
        return null;
    }
};

const createModel = async (storeId) => {
    const model = {
        "schema_version": "1.1",
        "type_definitions": [
          {
            "type": "user"
          },
          {
            "type": "document",
            "relations": {
              "reader": {
                "this": {}
              },
              "owner": {
                "this": {}
              }
            },
            "metadata": {
              "relations": {
                "reader": {
                  "directly_related_user_types": [
                    {
                      "type": "user"
                    }
                  ]
                },
                "owner": {
                  "directly_related_user_types": [
                    {
                      "type": "user"
                    }
                  ]
                }
              }
            }
          }
        ]
      };

    try {
        axios.post(`${apiUrl}/stores/${storeId}/authorization-models`, model, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Authorization model created');
        return response.authorization_model_id;
    } catch (error) {
        console.error('Error creating model:', error);
    }
};

const createTuple = async (storeId, modelId, user, relation, object) => {
    const tuple = {
        "writes": {
            "tuple_keys": [
              {
                "user": user,
                "relation": relation,
                "object": object
              }
            ]
          },
          "authorization_model_id": modelId
    }
    try {
        axios.post(`${apiUrl}/stores/${storeId}/write`, tuple, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(`Tuple created: ${user} ${relation} ${object}`);
    } catch (error) {
        console.error('Error creating tuple:', error);
    }
};

const checkAccess = async (storeId, user, relation, object) => {
    const tuple = {
        "tuple_key": {
            "user": "user" + user,
            "relation": relation,
            "object": object
          }
    }
    try {
        const response = axios.post(`${apiUrl}/stores/${storeId}/check`, tuple, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
          console.log(`Access check: ${user} ${relation} ${object} - Allowed: ${response.data.allowed}`);
    } catch (error) {
        console.error('Error checking access:', error);
    }
};

const main = async () => {
    const storeId = await createStore();
    if (storeId == null) return;
    const modelId = await createModel(storeId);
    if (modelId == null) return;

    await createTuple(storeId, modelId, 'alice', 'owner', 'document:doc1');
    await createTuple(storeId, modelId, 'bob', 'viewer', 'document:doc1');
    await checkAccess(storeId, 'alice', 'viewer', 'document:doc1');
    await checkAccess(storeId, 'bob', 'viewer', 'document:doc1');
}

main();
    