<template>
  <div>
    <h1>{{$curi.response.params.category}}</h1>
    <breadcrumbs name='Category' :params="$curi.response.params" />
    <p>List of products</p>
    <ul>
      <li v-for="product in $curi.response.data" :key="product.id">
        <curi-link to='Product' :params="linkParams(product.id)">
          {{title(product.name)}}
        </curi-link>
      </li>
    </ul>

  </div>
</template>

<script>
  import Breadcrumbs from './Breadcrumbs';

  export default {
    name: 'contact-method',
    methods: {
      title(name) {
        return this.$curi.config.addons.title('Product', { name });
      },
      linkParams(productID) {
        return { ...this.$curi.response.params, productID };
      }
    },
    components: { breadcrumbs: Breadcrumbs }
  };
</script>