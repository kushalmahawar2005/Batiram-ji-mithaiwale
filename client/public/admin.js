// Sample product data
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "Gulab Jamun",
        description: "Soft, golden brown milk dumplings soaked in sugar syrup",
        price: 200,
        category: "traditional",
        stock: 50,
        status: "active",
        image: "images/products/gulab-jamun.jpg"
    },
    {
        id: 2,
        name: "Rasgulla",
        description: "Spongy cottage cheese balls in light sugar syrup",
        price: 180,
        category: "traditional",
        stock: 40,
        status: "active",
        image: "images/products/rasgulla.jpg"
    },
    {
        id: 3,
        name: "Kaju Katli",
        description: "Diamond-shaped cashew fudge with silver coating",
        price: 400,
        category: "gift",
        stock: 30,
        status: "active",
        image: "images/products/kaju-katli.jpg"
    }
];

// Function to save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to update total products count
function updateTotalProducts() {
    const totalProductsElement = document.getElementById('totalProducts');
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }
}

// Function to display products in the table
function displayProducts() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable) return;

    const tbody = productsTable.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td><span class="badge ${product.status === 'active' ? 'bg-success' : 'bg-danger'}">${product.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const newProduct = {
        id: products.length + 1,
        name: form.productName.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        category: form.category.value,
        stock: parseInt(form.stock.value),
        status: form.status.value,
        image: form.image.value || "images/products/default.jpg"
    };

    products.push(newProduct);
    saveProducts();
    displayProducts();
    updateTotalProducts();

    // Show success message
    Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Reset form and close modal
    form.reset();
    $('#addProductModal').modal('hide');
}

// Function to delete a product
function deleteProduct(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            products = products.filter(product => product.id !== id);
            saveProducts();
            displayProducts();
            updateTotalProducts();
            
            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            );
        }
    });
}

// Function to edit a product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const form = document.getElementById('editProductForm');
    form.productId.value = product.id;
    form.productName.value = product.name;
    form.description.value = product.description;
    form.price.value = product.price;
    form.category.value = product.category;
    form.stock.value = product.stock;
    form.status.value = product.status;
    form.image.value = product.image;

    $('#editProductModal').modal('show');
}

// Function to update a product
function updateProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const id = parseInt(form.productId.value);
    
    const updatedProduct = {
        id: id,
        name: form.productName.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        category: form.category.value,
        stock: parseInt(form.stock.value),
        status: form.status.value,
        image: form.image.value || "images/products/default.jpg"
    };

    products = products.map(product => 
        product.id === id ? updatedProduct : product
    );

    saveProducts();
    displayProducts();
    updateTotalProducts();

    Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    $('#editProductModal').modal('hide');
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTables
    if ($.fn.DataTable) {
        $('#productsTable').DataTable({
            responsive: true,
            language: {
                search: "Search products:"
            }
        });
    }

    // Initialize Select2
    if ($.fn.select2) {
        $('.select2').select2({
            theme: 'bootstrap4'
        });
    }

    // Add event listeners
    document.getElementById('addProductForm')?.addEventListener('submit', addProduct);
    document.getElementById('editProductForm')?.addEventListener('submit', updateProduct);

    // Initial display
    displayProducts();
    updateTotalProducts();
}); 