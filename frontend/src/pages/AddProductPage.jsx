import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/ImageUpload';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AddProductPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [originalPackaging, setOriginalPackaging] = useState(false);
  const [manualIncluded, setManualIncluded] = useState(false);
  const [workingConditionDescription, setWorkingConditionDescription] = useState('');
  
  const { user } = useAuth();
  const { addProduct, updateProduct, products, categories, loadingCategories } = useData();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  
  const isEdit = !!productId;
  
  useEffect(() => {
    if (isEdit && productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setTitle(product.title);
        setDescription(product.description);
        setCategory(product.category);
        setPrice(product.price.toString());
        setImages(product.images || []);
        setQuantity(product.quantity.toString());
        setCondition(product.condition);
        setYearOfManufacture(product.yearOfManufacture?.toString() || '');
        setBrand(product.brand || '');
        setModel(product.model || '');
        setDimensions(product.dimensions || '');
        setWeight(product.weight || '');
        setMaterial(product.material || '');
        setColor(product.color || '');
        setOriginalPackaging(product.originalPackaging);
        setManualIncluded(product.manualIncluded);
        setWorkingConditionDescription(product.workingConditionDescription || '');
      }
    }
  }, [isEdit, productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "🔒 Authentication Required",
        description: "You must be logged in to add products. Please sign in first.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (!title.trim() || !description.trim() || !category || !price || !quantity || !condition) {
      toast({
        title: "⚠️ Missing Required Fields",
        description: "Please fill in all required fields: title, description, category, price, quantity, and condition.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    const priceNumber = parseFloat(price);
    const quantityNumber = parseInt(quantity);
    const yearNumber = yearOfManufacture ? parseInt(yearOfManufacture) : undefined;
    
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    if (yearNumber && (yearNumber < 1900 || yearNumber > new Date().getFullYear())) {
      toast({
        title: "\ud83d\udcc5 Invalid Year",
        description: `Please enter a valid year between 1900 and ${new Date().getFullYear()}.`,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      if (isEdit && productId) {
        await updateProduct(productId, {
          title: title.trim(),
          description: description.trim(),
          category,
          price: priceNumber,
          images,
          quantity: quantityNumber,
          condition: condition,
          yearOfManufacture: yearNumber,
          brand: brand.trim() || undefined,
          model: model.trim() || undefined,
          dimensions: dimensions.trim() || undefined,
          weight: weight.trim() || undefined,
          material: material.trim() || undefined,
          color: color.trim() || undefined,
          originalPackaging,
          manualIncluded,
          workingConditionDescription: workingConditionDescription.trim() || undefined,
        });
        toast({
          title: "✅ Product Updated!",
          description: `${title} has been updated successfully.`,
          duration: 3000,
        });
      } else {
        if (import.meta.env.VITE_DEBUG === '1') {
          console.debug('[ADD_PRODUCT_SUBMIT]', {
            title: title.trim(), category, price: priceNumber, qty: quantityNumber, imgs: images.length
          });
        }
        const ok = await addProduct({
          title: title.trim(),
          description: description.trim(),
          category,
          price: priceNumber,
          images: images && images.length ? images : undefined,
          condition: condition,
          quantity: quantityNumber,
          details: {
            yearOfManufacture: yearNumber,
            brand: brand.trim() || undefined,
            model: model.trim() || undefined,
            dimensions: dimensions.trim() || undefined,
            weight: weight.trim() || undefined,
            material: material.trim() || undefined,
            color: color.trim() || undefined,
          },
          extras: {
            originalPackaging,
            manualIncluded,
          },
          workingCondition: workingConditionDescription.trim() || undefined,
        });
        if (!ok) {
          toast({
            title: '❌ Failed to Add Product',
            description: 'Unable to add product. Please check your connection and try again.',
            variant: 'destructive',
            duration: 4000,
          });
          return;
        }
        toast({
          title: "✅ Product Added!",
          description: `${title} has been added to your listings successfully.`,
          duration: 3000,
        });
      }
      
      navigate('/my-listings');
    } catch (error) {
      toast({
        title: "⚠️ Error Saving Product",
        description: "Failed to save product. Please check your connection and try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleImageUpload = (files) => {
    // Convert files to URLs for preview (in real app, upload to cloud storage)
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8 animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 text-white hover:text-pink-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-light tracking-tight text-white">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-400">
                {isEdit ? 'Update your product details' : 'List a new item for sale'}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <Card className="backdrop-blur-md bg-[#1B1B1B]/90 border border-pink-900/30 shadow-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="font-light text-white">Product Details</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Product Images</Label>
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    images={images}
                    onRemoveImage={handleRemoveImage}
                  />
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Product Title */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title" className="text-white">Product Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter product title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Category (free entry with suggestions) */}
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category *</Label>
                      <div className="relative">
                        <Input
                          id="category"
                          list="category-suggestions"
                          placeholder={loadingCategories ? 'Loading categories...' : 'Type or select a category'}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                        />
                        <datalist id="category-suggestions">
                          {categories.filter(c => c !== 'All Categories').map(c => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>
                      <p className="text-xs text-muted-foreground">Start typing to create a new category or pick an existing one.</p>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-white">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Condition */}
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="text-white">Condition *</Label>
                      <Select value={condition} onValueChange={setCondition} required>
                        <SelectTrigger className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Used">Used</SelectItem>
                          <SelectItem value="Heavily Used">Heavily Used</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ₹
                        </span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          className="pl-8 px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Year of Manufacture */}
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-white">Year of Manufacture</Label>
                      <Input
                        id="year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        placeholder="2020"
                        value={yearOfManufacture}
                        onChange={(e) => setYearOfManufacture(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-white">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="Enter brand name"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-white">Model</Label>
                      <Input
                        id="model"
                        placeholder="Enter model name"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-2">
                      <Label htmlFor="dimensions" className="text-white">Dimensions</Label>
                      <Input
                        id="dimensions"
                        placeholder="e.g., 12x8x4 cm"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-white">Weight</Label>
                      <Input
                        id="weight"
                        placeholder="e.g., 2.5 kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Material */}
                    <div className="space-y-2">
                      <Label htmlFor="material" className="text-white">Material</Label>
                      <Input
                        id="material"
                        placeholder="Enter material"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label htmlFor="color" className="text-white">Color</Label>
                      <Input
                        id="color"
                        placeholder="Enter color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Extras */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Extras</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="packaging"
                        checked={originalPackaging}
                        onCheckedChange={(checked) => setOriginalPackaging(checked)}
                      />
                      <Label htmlFor="packaging" className="text-sm font-normal">
                        Original Packaging Included
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="manual"
                        checked={manualIncluded}
                        onCheckedChange={(checked) => setManualIncluded(checked)}
                      />
                      <Label htmlFor="manual" className="text-sm font-normal">
                        Manual/Instructions Included
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white resize-none"
                  />
                </div>

                {/* Working Condition Description */}
                <div className="space-y-2">
                  <Label htmlFor="workingCondition" className="text-white">Working Condition Description</Label>
                  <Textarea
                    id="workingCondition"
                    placeholder="Describe the working condition and any issues..."
                    value={workingConditionDescription}
                    onChange={(e) => setWorkingConditionDescription(e.target.value)}
                    rows={3}
                    className="px-4 py-2 rounded-md bg-[#1B1B1B] border border-gray-700 text-white resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white shadow-lg shadow-red-500/30"
                  >
                    {isEdit ? 'Update Product' : 'List Product'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};