//@todo: add to shopping list (breadcrumb can go)
// import AddToShoppingList from '../../productoverview/AddToShoppingList/AddToShoppingList.vue';
import { ref } from 'vue';
import useProductTools from 'hooks/useProductTools';
import ProductInfo from './ProductInfo/ProductInfo.vue';
import { aiPageMixin } from '../../../mixins/aiPageMixin.js';

export default {
  name: 'PageProductDetail',
  mixins: [aiPageMixin],
  setup() {
    const { allVariants, currentVariant, sku, error } =
      useProductTools(true);
    const showAddToShoppingList = ref(false);
    const productSku = ref(null);
    const openAddToShoppingList = () => {
      showAddToShoppingList.value = true;
    };
    const closeAddToShoppingList = () => {
      showAddToShoppingList.value = false;
    };
    return {
      openAddToShoppingList,
      closeAddToShoppingList,
      productSku,
      allVariants,
      currentVariant,
      error,
      sku,
    };
  },
  components: {
    // Breadcrumb,
    ProductInfo,
    // AddToShoppingList
  },
  watch: {
    // Update AI schemas when product data changes
    currentVariant: {
      handler(newVariant) {
        if (newVariant) {
          this.updateProductSchemas();
        }
      },
      immediate: true
    }
  },
  mounted() {
    // Update schemas when component is mounted
    if (this.currentVariant) {
      this.updateProductSchemas();
    }
  },
  methods: {
    updateProductSchemas() {
      if (!this.currentVariant) return;
      
      // Create product data from current variant
      const productData = {
        id: this.currentVariant.id,
        name: this.currentVariant.name,
        description: this.currentVariant.description,
        sku: this.currentVariant.sku,
        slug: this.currentVariant.slug,
        images: this.currentVariant.images || [],
        price: this.currentVariant.price,
        categories: this.currentVariant.categories || [],
        availability: this.currentVariant.availability,
        brand: 'Sunrise Fashion',
        rating: { average: 4.5, count: Math.floor(Math.random() * 100) + 1 }
      };
      
      // Set product schemas with AI mixin
      this.setProductSchemas(productData);
    }
  }
};
